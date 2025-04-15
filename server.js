const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
const movieRoutes = require("./routes/movies");
app.use("/movies", movieRoutes);


// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/moviereviews", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Simple route to check if server is running
app.get("/", (req, res) => {
  res.send("Movie Review API is running!");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});