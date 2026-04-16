const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
        tags: [{ type: String }],
        examples: [{ input: String, output: String, explanation: String }],
        constraints: [String],
        starterCode: {
            javascript: { type: String, default: "// Write your solution here\n" },
            python: { type: String, default: "# Write your solution here\n" },
            java: { type: String, default: "// Write your solution here\n" },
            cpp: { type: String, default: "// Write your solution here\n" },
        },
        solvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        leetcodeNumber: { type: Number, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);