import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { SendCommentNotificationEmail } from "../mails/emailHandlers.js";
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id] },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    let { image, content } = req.body;
    let post;

    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      const imageUrl = uploadRes.secure_url;

      post = new Post({
        author: req.user._id,
        content,
        image: imageUrl,
      });
    } else {
      post = new Post({
        author: req.user._id,
        content,
      });
    }

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete others' posts" });
    }

    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};
export const commentOnPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add comment
    post.comments.push({ content, user: userId });
    await post.save();

    // Populate author for notification logic
    const populatedPost = await post.populate({
      path: "author",
      select: "name email username profilePicture headline",
    });

    // Check if commenter is the post owner
    const isOwnPost = populatedPost.author._id.equals(userId);

    if (!isOwnPost) {
      // Create notification
      const notification = new Notification({
        recipient: populatedPost.author._id,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId,
      });
      await notification.save();

      // Send email notification
      try {
        const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
        await SendCommentNotificationEmail(
          populatedPost.author.email,
          populatedPost.author.name,
          req.user.name,
          content,
          postUrl
        );
      } catch (error) {
        console.error("Error sending comment notification email:", error);
      }
    }

    res.status(201).json({
      message: "Comment added successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const LikeOrUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);

      if (post.author.toString() !== userId.toString()) {
        const notification = new Notification({
          recipient: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });
        await notification.save();
      }
    }

    await post.save();

    res.status(200).json({
      message: isLiked
        ? "Post unliked successfully"
        : "Post liked successfully",
      post,
    });
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).json({ message: "Failed to update like status" });
  }
};
