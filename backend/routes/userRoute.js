import express from "express";
import {
  registerUser,
  verification,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  changePassword,
} from "../controllers/userController.js";
import { jwtAuthMiddleware } from "../middleware/isAuthenticated.js";
import { userSchema, validateUser } from "../validators/userValidate.js";

const router = express.Router();

router.post("/register", validateUser(userSchema), registerUser);
router.post("/verify", verification);
router.post("/login", loginUser);
router.post("/logout", jwtAuthMiddleware, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOtp);
router.post("/change-password/:email", changePassword);

export default router;
