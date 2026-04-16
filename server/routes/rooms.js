const express = require("express");
const router = express.Router();
const { createRoom, getRooms, getRoom, saveCode, closeRoom } = require("../controllers/roomController");
const { protect } = require("../middleware/auth");

router.get("/", getRooms);
router.post("/", protect, createRoom);
router.get("/:roomId", getRoom);
router.patch("/:roomId/code", protect, saveCode);
router.delete("/:roomId", protect, closeRoom);

module.exports = router;