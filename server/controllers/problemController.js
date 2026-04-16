const Problem = require("../models/Problem");
const User = require("../models/User");

const getProblems = async (req, res) => {
    const { difficulty, tag, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: "i" };
    try {
        const total = await Problem.countDocuments(filter);
        const problems = await Problem.find(filter)
            .select("title slug difficulty tags solvedBy leetcodeNumber")
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ leetcodeNumber: 1 });
        res.json({ problems, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch problems" });
    }
};

const getProblem = async (req, res) => {
    try {
        const problem = await Problem.findOne({ slug: req.params.slug });
        if (!problem) return res.status(404).json({ message: "Problem not found" });
        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch problem" });
    }
};

const markSolved = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const problem = await Problem.findById(id);
        if (!problem) return res.status(404).json({ message: "Problem not found" });
        const user = await User.findById(userId);
        const alreadySolved = user.solvedProblems.includes(id);
        if (alreadySolved) {
            user.solvedProblems = user.solvedProblems.filter((p) => p.toString() !== id);
            problem.solvedBy = problem.solvedBy.filter((u) => u.toString() !== userId);
        } else {
            user.solvedProblems.push(id);
            problem.solvedBy.push(userId);
        }
        await user.save();
        await problem.save();
        res.json({ solved: !alreadySolved, totalSolved: user.solvedProblems.length });
    } catch (err) {
        res.status(500).json({ message: "Failed to update solve status" });
    }
};

const createProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json(problem);
    } catch (err) {
        res.status(500).json({ message: "Failed to create problem" });
    }
};

module.exports = { getProblems, getProblem, markSolved, createProblem };