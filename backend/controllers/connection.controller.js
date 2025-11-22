import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { SendConnectionAcceptedEmail } from "../mails/emailHandlers.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }

    if (req.user.connections.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already connected with this user" });
    }

    const existingRequest = await Connection.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    const newRequest = new Connection({
      sender: senderId,
      recipient: userId,
    });

    await newRequest.save();

    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ message: "Failed to send connection request" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Connection.findById(requestId)
      .populate("sender", "name email username")
      .populate("recipient", "name username");

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (request.recipient._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to accept this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });

    const notification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });
    await notification.save();

    const emailToSend = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl = `${process.env.CLIENT_URL}/profile/${request.recipient.username}`;

    try {
      await SendConnectionAcceptedEmail(
        emailToSend,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res.status(500).json({ message: "Failed to accept connection request" });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Connection.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (request.recipient.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to reject this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request has already been processed" });
    }

    request.status = "rejected";
    await request.save();

    res
      .status(200)
      .json({ message: "Connection request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    res.status(500).json({ message: "Failed to reject connection request" });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Connection.find({
      recipient: userId,
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name username profilePicture headline connections");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ message: "Failed to fetch connection requests" });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline connections"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.connections);
  } catch (error) {
    console.error("Error fetching user connections:", error);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.userId;

    if (userId.toString() === targetId) {
      return res.status(400).json({ message: "You can't remove yourself" });
    }

    // Remove each other from connections

    await User.findByIdAndUpdate(userId, {
      $pull: { connections: targetId },
    });

    await User.findByIdAndUpdate(targetId, {
      $pull: { connections: userId },
    });

    res.status(200).json({ message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error removing connection:", error);
    res.status(500).json({ message: "Failed to remove connection" });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;
    const currentUser = req.user;

    // Check if already connected
    if (currentUser.connections.includes(targetUserId)) {
      return res.json({ status: "connected" });
    }

    // Check for pending request (sent or received)
    const pendingRequest = await Connection.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({
          status: "pending",
          requestId: pendingRequest._id.toString(),
        });
      } else {
        return res.json({
          status: "received",
          requestId: pendingRequest._id.toString(),
        });
      }
    }

    // No connection or pending request
    res.json({ status: "not_connected" });
  } catch (error) {
    console.error("Error in getConnectionStatus controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
