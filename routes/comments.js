/**
 * ===========================================
 * COMMENT ROUTES - TITO's TASK
 * ===========================================
 *
 * These routes handle creating, reading, and deleting comments on stories.
 *
 * ENDPOINTS:
 * - GET /api/stories/:storyId/comments - Get all comments for a story
 * - POST /api/stories/:storyId/comments - Create comment on a story
 * - DELETE /api/comments/:id - Delete a comment (own only)
 *
 * YOUR TASKS:
 * 1. Implement all three routes
 * 2. Use protect middleware for create/delete
 * 3. Populate author username in responses
 * 4. Only allow users to delete their own comments
 *
 * ESTIMATED TIME: 3-4 hours
 */

const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Story = require("../models/Story");
const { protect } = require("../middleware/auth");

/**
 * @route   GET /api/stories/:storyId/comments
 * @desc    Get all comments for a specific story
 * @access  Public
 */
router.get("/stories/:storyId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ story: req.params.storyId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/stories/:storyId/comments
 * @desc    Create a comment on a story
 * @access  Private
 */
router.post("/stories/:storyId/comments", protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Verify story exists
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      story: req.params.storyId,
    });

    await comment.populate("author", "username");
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/comments/:id
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (owner only)
 */
router.delete("/comments/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ownership check
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

module.exports = router;
