import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  const person = this;
  // Hash the password only if it has been modified (or is new)
  if (!person.isModified("password")) return;
  try {
    // Generate a Salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(person.password, salt);
    // Override the plain password with the hashed one
    person.password = hashedPassword;
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
