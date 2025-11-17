const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/dashboard", auth, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Access denied. Admins only." });

  res.json({ message: "Welcome to the admin dashboard!", admin: { id: req.user._id, username: req.user.username, role: req.user.role   } });
});

module.exports = router;

