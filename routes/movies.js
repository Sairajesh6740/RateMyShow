const express = require("express");
const Movie = require("../models/Movie");
const router = express.Router();

// Create a new movie review
router.post("/", async (req, res) => {
  try {
    const { title, review, rating } = req.body;
    const newMovie = new Movie({ title, review, rating });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all movie reviews
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a movie review
router.delete("/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  // Update a movie review
router.put('/:id', async (req, res) => {
  try {
      const { title, review, rating } = req.body;
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { title, review, rating }, { new: true });
      res.json(updatedMovie);
  } catch (error) {
      res.status(500).json({ message: "Error updating movie", error });
  }
});
});

module.exports = router;
