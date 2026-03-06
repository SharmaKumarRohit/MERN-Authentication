import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { emailVerify } from "../emailVerify/emailVerification.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import { Session } from "../models/session.js";

const generateToken = (userData, expiresIn) => {
  return jwt.sign(userData, process.env.SECRET_KEY, { expiresIn });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }
    const newUser = new User({ username, email, password });
    const user = await newUser.save();
    const token = generateToken({ id: user._id }, "10m");
    emailVerify(token, email);
    user.token = token;
    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verification = async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization Token is Missing or Invalid",
      });
    }
    const token = authorization.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has been expired",
        });
      }
      return res
        .status(400)
        .json({ success: false, message: "Token verification failed" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not exist for this email!" });
    }
    if (!(await user.comparePassword(password))) {
      return res
        .status(402)
        .json({ success: false, message: "Incorrect Password!" });
    }
    // Check if user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Verify your account then login!" });
    }
    // Check for existing session and delete it
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
      await Session.deleteOne({ userId: user._id });
    }
    // Create a new session
    await Session.create({ userId: user._id });
    // Generate tokens
    const accessToken = generateToken({ id: user._id }, "10d");
    const refreshToken = generateToken({ id: user._id }, "30d");
    user.isLoggedIn = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.username}!`,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { userId } = req;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000) + "";
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendOtpMail(email, otp);
    return res
      .status(200)
      .json({ success: true, message: "OTP send successfully on your email." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const { email } = req.params;

  if (!otp) {
    return res
      .status(400)
      .json({ success: false, message: "OTP is required!" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already verified",
      });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { email } = req.params;

  if (!newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password do not match." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
