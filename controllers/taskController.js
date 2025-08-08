const Compliance = require("../models/compliance");

// @desc    Get all tasks/compliances of the logged-in user
// @route   GET /api/tasks
// @access  Private
const getUserTasks = async (req, res) => {
  try {
    const tasks = await Compliance.find({ user: req.user.id });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getUserTasks:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getUserTasks };
