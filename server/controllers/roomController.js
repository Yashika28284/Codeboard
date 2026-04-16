const Room = require("../models/Room");
const User = require("../models/User");

const createRoom = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Room name is required" });
    try {
        const room = await Room.create({ name, host: req.user.id, participants: [req.user.id] });
        await User.findByIdAndUpdate(req.user.id, { $push: { createdRooms: room._id } });
        await room.populate("host", "username");
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ message: "Failed to create room" });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isActive: true, isPrivate: false })
            .populate("host", "username")
            .populate("problem", "title difficulty")
            .populate("participants", "username")
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
};

const getRoom = async (req, res) => {
    try {
        const room = await Room.findOne({ roomId: req.params.roomId })
            .populate("host", "username")
            .populate("problem", "title difficulty slug description starterCode examples constraints")
            .populate("participants", "username");
        if (!room) return res.status(404).json({ message: "Room not found" });
        if (!room.isActive) return res.status(410).json({ message: "This room has been closed" });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch room" });
    }
};

const saveCode = async (req, res) => {
    const { code, language } = req.body;
    try {
        const room = await Room.findOneAndUpdate({ roomId: req.params.roomId }, { currentCode: code, language }, { new: true });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json({ message: "Code saved" });
    } catch (err) {
        res.status(500).json({ message: "Failed to save code" });
    }
};

const closeRoom = async (req, res) => {
    try {
        const room = await Room.findOne({ roomId: req.params.roomId });
        if (!room) return res.status(404).json({ message: "Room not found" });
        if (room.host.toString() !== req.user.id) return res.status(403).json({ message: "Only the host can close this room" });
        room.isActive = false;
        await room.save();
        res.json({ message: "Room closed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to close room" });
    }
};

module.exports = { createRoom, getRooms, getRoom, saveCode, closeRoom };
