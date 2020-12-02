const express = require("express");
// Array of movies
const movies = require("./movies");
// In codesandbox we need to use the default port which is 8080
const connection = require("./config");

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});



const app = express() ;
const port = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to my favourite movie list");
});


app.get("/api/movies", (req, res) => {
  connection.query("SELECT * from movies", 
  (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  }
  )
  });
  
  app.get("/api/movies/:id", (req, res) => {
    const movie = movies.find((movie) => {
      return movie.id === Number(req.params.id);
    });
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).send("Not found");
    }
  });

  app.get("/api/search", (req, res) => {
    const matchingMovies = movies.filter(
      (movie) => movie.duration <= req.query.maxDuration
    );
    if (matchingMovies.length > 0) {
      res.json(matchingMovies);
    } else {
      res.status(404).send("No movies found for this duration");
    }
  });
 app.get("/api/users", (req, res) => {
    res.status(401).send("Unauthorized");
  });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});