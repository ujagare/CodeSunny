exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      emailVerified: req.user.emailVerified,
    },
  });
};

exports.adminPing = async (_req, res) => {
  res.json({ success: true, message: "Admin access granted" });
};
