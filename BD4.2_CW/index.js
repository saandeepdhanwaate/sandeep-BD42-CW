const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
(async () => {
  try {
    db = await open({
      filename: "./BD4.2_CW/database.sqlite",
      driver: sqlite3.Database,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error(error.message);
  }
})();

// 1 = movies
async function fetchAllMovies() {
  let query = "SELECT * FROM movies";
  let response = await db.all(query, []);
  return { movies: response };
}
app.get("/movies", async (req, res) => {
  try {
    let result = await fetchAllMovies();

    if (result.movies.length === 0) {
      return res.status(404).json({ message: "Movies not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 2 - /movies/genre/:genre
async function fetchMovieByGenre(genre) {
  let query = "SELECT * FROM movies WHERE genre = ?";
  let response = await db.all(query, [genre]);
  return { movies: response };
}
app.get("/movies/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await fetchMovieByGenre(genre);
    if (result.movies.length === 0) {
      return res.status(404).json({ messaege: "no movies found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 3 - /movies/details/:id

async function fetchMovieById(id) {
  let query = "SELECT * FROM movies WHERE id = ?";
  let response = await db.all(query, [id]);
  return { movies: response };
}

app.get("/movies/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchMovieById(id);
    if (result.movies.length === 0) {
      return res.status(404).json({ movies: "Movies not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 4- /movies/release_year/:year
async function fetchMovieByReleaseYear(releaseyear) {
  let query = "SELECT * FROM movies WHERE release_year  = ?";
  let response = await db.all(query, [releaseyear]);
  return { movies: response };
}
app.get("/movies/release-year/:releaseyear", async (req, res) => {
  try {
    let year = req.params.releaseyear;
    let result = await fetchMovieByReleaseYear(year);
    if (result.movies.length === 0) {
      return res.status(404).json({ movies: "Movies not found by year" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
