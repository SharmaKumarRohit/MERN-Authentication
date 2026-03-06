import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import "dotenv/config";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import "./config/passport.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use("/auth", authRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Welcome to our MERN Authentication site");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on port http://localhost:${PORT}`);
});

export default app;
