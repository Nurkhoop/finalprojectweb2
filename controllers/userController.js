const User = require("../models/User");

// READ ALL USERS (admin)
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// READ ONE USER (admin)
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// UPDATE USER ROLE (admin)
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// SOFT DELETE USER (admin)
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isDeleted = true;
  user.email = "deleted@user.com";
  await user.save();

  res.json({ message: "User soft deleted" });
};