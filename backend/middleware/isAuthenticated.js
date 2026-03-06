import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const jwtAuthMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Token is Missing or Invalid",
      });
    }
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(400).json({
            success: false,
            message: "Acess token expired, use refresh token to generate again",
          });
        }
        return res.status(400).json({
          success: false,
          message: "Access Token is Missing or Invalid",
        });
      }
      const { id } = decoded;
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      }
      req.user = user;
      req.userId = user._id;
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
