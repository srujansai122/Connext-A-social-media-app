import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../mails/emailHandlers.js";

export async function Signup(req, res) {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !password || !email)
      return res.status(400).json({ message: "Enter All Fields" });

    const ifExistsEmail = await User.findOne({ email });
    if (ifExistsEmail)
      return res.status(400).json({ message: "Email already Exists" });
    const ifExistsUsername = await User.findOne({ username });
    if (ifExistsUsername)
      return res.status(400).json({ message: "Username already Exists" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("jwt-connext", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (emailerror) {
      console.log("Error in Signup mailtrap", emailerror);
    }

    res.status(201).json({ message: "User Registered Sucessfully!" });
  } catch (error) {
    console.log("Error in Signup Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function Login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const ispasswordMatch = await bcrypt.compare(password, user.password);
    if (!ispasswordMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("jwt-connext", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ message: "Logged In succesfully!" });
  } catch (error) {
    console.log("Error in Login Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function Logout(req, res) {
  res.clearCookie("jwt-connext");
  res.json({ message: "Logged out sucessfully" });
}

export async function getCurrentUser(req, res) {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getCurrentUser Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
