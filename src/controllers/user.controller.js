const User = require("../models/users.model");

// 회원가입 (User 생성)
exports.signup = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: "Signup failed", details: err });
  }
};

// 모든 유저 조회 (Optional)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users", details: err });
  }
};

// 특정 유저 조회 (Optional)
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user", details: err });
  }
};
