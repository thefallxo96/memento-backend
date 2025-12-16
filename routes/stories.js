/**
 * ===========================================
 * STORY ROUTES - NATALIA's TASK (CRUD) + COLIN's TASK (Likes)
 * ==========================================
 */

const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { protect } = require("../middleware/auth");

/**
 * @route   GET /api/stories
 * @desc    Get all stories
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  const stories = await Story.find()
    .populate("author", "username")
    .sort({ createdAt: -1 });

  res.json(stories);
});

/**
 * @route   GET /api/stories/:id
 * @desc    Get single story by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  const story = await Story.findById(req.params.id).populate(
    "author",
    "username"
  );

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  res.json(story);
});

/**
 * @route   POST /api/stories
 * @desc    Create a new story
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  // POST CREATE STORY
  // TODO: Implement create story (NATALIA)
  console.log("✅ Reached POST /api/stories route");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  try {
    const { title, content } = req.body;

    const story = await Story.create({
      title,
      content,
      author: req.user._id,
    });
    //
    // // Populate author for the response
    await story.populate("author", "username");

    res.status(201).json(story);
  } catch (error) {
    console.error("Create story error:", error.message);
    res.status(500).json({ message: "Server error" });
  }

  // res.json({ message: "TODO: Implement create story" });
});

/**
 * @route   PUT /api/stories/:id
 * @desc    Update a story
 * @access  Private (owner only)

 */
router.put("/:id", protect, async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this story" });
  }
  story.title = req.body.title || story.title;
  story.content = req.body.content || story.content;

  await story.save();
  await story.populate("author", "username");

  res.json(story);
});

/**
 * @route   DELETE /api/stories/:id
 * @desc    Delete a story
 * @access  Private (owner only)
 */
router.delete("/:id", protect, async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this story" });
  }

  await story.deleteOne();

  res.json({ message: "Story deleted" });
});

/**
 * ===========================================
 * @route   PUT /api/stories/:id/like
 * @desc    Toggle like on a story
 * @access  Private
 *
 * COLIN's TASK
 * ===========================================
 */
router.put("/:id/like", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if already liked
    // We utilize .some() and convert to strings to ensure ObjectId comparison works
    const alreadyLiked = story.likes.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike: remove user ID from likes array
      story.likes = story.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like: add user ID to likes array
      story.likes.push(req.user._id);
    }

    await story.save();
    await story.populate("author", "username");

    res.json(story);
  } catch (error) {
    console.error("Like error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
