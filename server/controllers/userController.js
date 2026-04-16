const User = require("../models/User");

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select("-password -email")
            .populate("solvedProblems", "title difficulty slug tags");
        if (!user) return res.status(404).json({ message: "User not found" });
        const stats = {
            total: user.solvedProblems.length,
            easy: user.solvedProblems.filter((p) => p.difficulty === "Easy").length,
            medium: user.solvedProblems.filter((p) => p.difficulty === "Medium").length,
            hard: user.solvedProblems.filter((p) => p.difficulty === "Hard").length,
        };
        res.json({ user, stats });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

const updateProfile = async (req, res) => {
    const { bio, leetcodeHandle } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { bio, leetcodeHandle }, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};

module.exports = { getProfile, updateProfile };