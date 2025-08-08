const User = require("../models/User");
const Compliance = require("../models/compliance");

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Getting from decoded token

    const user = await User.findById(userId).select("name email services payments");
    if (!user) return res.status(404).json({ message: "User not found" });

    const compliance = await Compliance.find({ userId });
    const completedCount = compliance.filter(c => c.status === "completed").length;
    const pendingCount = compliance.filter(c => c.status === "pending").length;
    const total = compliance.length;
    const completionRate = total > 0 ? ((completedCount / total) * 100).toFixed(2) : 0;

    res.json({
      user: {
        name: user.name,
        email: user.email,
        services: user.services,
        payments: user.payments,
      },
      compliance,
      stats: {
        total,
        completed: completedCount,
        pending: pendingCount,
        completionRate,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getUserDashboard };
