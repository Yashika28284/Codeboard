const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roomSchema = new mongoose.Schema(
    {
        roomId: { type: String, default: () => uuidv4().slice(0, 8).toUpperCase(), unique: true },
        name: { type: String, required: true, trim: true, maxlength: 50 },
        problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", default: null },
        host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        isPrivate: { type: Boolean, default: false },
        currentCode: { type: String, default: "// Start coding together!\n" },
        language: { type: String, enum: ["javascript", "python", "java", "cpp"], default: "javascript" },
        isActive: { type: Boolean, default: true },
        messages: [{ username: String, message: String, timestamp: { type: Date, default: Date.now } }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);