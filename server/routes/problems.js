const express = require("express");
const router = express.Router();
const { getProblems, getProblem, markSolved, createProblem } = require("../controllers/problemController");
const { protect } = require("../middleware/auth");

router.get("/", getProblems);
router.get("/:slug", getProblem);
router.post("/", protect, createProblem);
router.post("/:id/solve", protect, markSolved);

module.exports = router;