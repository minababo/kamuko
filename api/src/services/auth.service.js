const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function registerUser(data) {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error("Email already registered");

  const user = await User.create(data);
  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const ok = await user.comparePassword(password);
  if (!ok) throw new Error("Invalid credentials");

  return user;
}

module.exports = { generateToken, registerUser, loginUser };