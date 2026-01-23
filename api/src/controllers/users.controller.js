const User = require("../models/User");

async function getMe(req, res) {
  return res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    username: req.user.username || "",
    profileImageUrl: req.user.profileImageUrl || "",
  });
}

async function updateMe(req, res) {
  try {
    const { name, email, username, profileImageUrl } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = String(name).trim();
    if (username !== undefined) updates.username = String(username).trim();
    if (profileImageUrl !== undefined) {
      updates.profileImageUrl = String(profileImageUrl).trim();
    }

    if (email !== undefined) {
      updates.email = String(email).toLowerCase().trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    return res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      username: updatedUser.username || "",
      profileImageUrl: updatedUser.profileImageUrl || "",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already in use" });
    }
    return res.status(400).json({ error: err.message });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "currentPassword and newPassword are required",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isValid = await user.comparePassword(String(currentPassword));
    if (!isValid) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    user.password = String(newPassword);
    await user.save();

    return res.json({ message: "Password updated" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update password",
    });
  }
}

module.exports = { getMe, updateMe, changePassword };
