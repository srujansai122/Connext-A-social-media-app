import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post }) => {
  const { postId } = useParams();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/checkLoggedInOrNot");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) return null;
        toast.error(
          error?.response?.data?.message || "Something went wrong 😔"
        );
      }
    },
  });

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser?._id === post.author._id;
  const isLiked = post.likes.includes(authUser?._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handleLikePost = () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6 transition-colors duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post.author.profilePicture || "/avatar.png"}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3 border border-gray-300 dark:border-gray-700"
              />
            </Link>
            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.author.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.author.headline}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>

        <p className="mb-4 text-gray-800 dark:text-gray-100">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4 border border-gray-200 dark:border-gray-700"
          />
        )}

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500 fill-blue-300" : ""}
              />
            }
            text={`Likes (${post.likes.length})`}
            onClick={handleLikePost}
          />
          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment, index) => (
              <div
                key={comment._id || index}
                className="mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded flex items-start"
              >
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0 border border-gray-300 dark:border-gray-700"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-100 mr-2">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-l-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 disabled:opacity-50"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;

function PostAction({ icon, text, onClick }) {
  return (
    <button
      className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      onClick={onClick}
    >
      <span className="mr-1">{icon}</span>
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}
