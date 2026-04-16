const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            return res.status(409).json({ message: `${field} is already taken` });
        }
        const user = await User.create({ username, email, password });
        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, solvedProblems: [], bio: "" } });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ message: messages[0] });
        }
        res.status(500).json({ message: "Server error during registration" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    try {
        const user = await User.findOne({ email }).populate("solvedProblems", "title difficulty");
        if (!user) return res.status(401).json({ message: "Invalid credentials" });
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
        const token = generateToken(user);
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, solvedProblems: user.solvedProblems, bio: user.bio } });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password").populate("solvedProblems", "title difficulty slug tags");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

module.exports = { register, login, getMe };
