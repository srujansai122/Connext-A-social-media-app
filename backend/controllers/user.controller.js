import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const getSuggestedConnections = async (req, res) => {
  try {
    const currentUserData = await User.findById(req.user._id).select(
      "connections"
    );
    const suggestedConnections = await User.find({
      _id: { $ne: req.user._id, $nin: currentUserData.connections },
    })
      .select("name username profilePicture headline")
      .limit(3);
    res.status(200).json(suggestedConnections);
  } catch (error) {
    console.error("Error fetching suggested connections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    if (!user) res.status(404).json({ message: "User not Found" });
    res.json(user);
  } catch (error) {
    console.error("Error in getting Public Profile Controller :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "profilePicture",
      "bannerImage",
      "skills",
      "experience",
      "education",
    ];

    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field]) updatedData[field] = req.body[field];
    }

    if (req.body.profilePicture) {
      const res = await cloudinary.uploader.upload(req.body.profilePicture);
      updatedData.profilePicture = res.secure_url;
    }

    if (req.body.bannerImage) {
      const res = await cloudinary.uploader.upload(req.body.bannerImage);
      updatedData.bannerImage = res.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Error in updating Profile controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
