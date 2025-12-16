/**
 * ===========================================
 * MEMENTO BACKEND - Main Server Entry Point
 * ===========================================
 *
 * This file is the starting point of our Express application.
 * It sets up middleware, connects to the database, and mounts routes.
 *
 * PABLO will complete this file during integration.
 * For now, the structure is set up for the team.
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from .env file
dotenv.config();

// Import database connection (COLIN's task)
const connectDB = require("./config/db");

// Import route files
const authRoutes = require("./routes/auth"); // NATALIA's routes
const storyRoutes = require("./routes/stories"); // NATALIA's routes
const commentRoutes = require("./routes/comments"); // TITO's routes

// Initialize Express app
const app = express();

// ===========================================
// MIDDLEWARE SETUP
// ===========================================

// Enable CORS - allows frontend to make requests to this API
app.use(cors());

// Parse JSON request bodies - req.body will contain parsed JSON
app.use(express.json());

// ===========================================
// CONNECT TO DATABASE
// ===========================================

// Connect to MongoDB (COLIN implements the connectDB function)
// connectDB();
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ===========================================
// MOUNT ROUTES
// ===========================================

// All auth routes will be prefixed with /api/auth
// Example: POST /api/auth/signup, POST /api/auth/login
app.use("/api/auth", authRoutes);

// All story routes will be prefixed with /api/stories
// Example: GET /api/stories, POST /api/stories
app.use("/api/stories", storyRoutes);

// All comment routes will be prefixed with /api
// Example: POST /api/stories/:id/comments, DELETE /api/comments/:id
app.use("/api", commentRoutes);

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
