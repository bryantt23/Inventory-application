#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Movie = require('./models/movie');
var Genre = require('./models/genre');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var genres = [];
var movies = [];

// function authorCreate(first_name, family_name, d_birth, d_death, cb) {
//   authordetail = {first_name:first_name , family_name: family_name }
//   if (d_birth != false) authordetail.date_of_birth = d_birth
//   if (d_death != false) authordetail.date_of_death = d_death

//   var author = new Author(authordetail);

//   author.save(function (err) {
//     if (err) {
//       cb(err, null)
//       return
//     }
//     console.log('New Author: ' + author);
//     authors.push(author)
//     cb(null, author)
//   }  );
// }

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function movieCreate(title, summary, year, genre, imageUrl = '', cb) {
  moviedetail = {
    title: title,
    summary: summary,
    year: year,
    imageUrl: imageUrl
  };
  if (genre != false) moviedetail.genre = genre;

  var movie = new Movie(moviedetail);
  movie.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Movie: ' + movie);
    movies.push(movie);
    cb(null, movie);
  });
}

function createGenres(cb) {
  async.series(
    [
      function (callback) {
        genreCreate('Comics', callback);
      },
      function (callback) {
        genreCreate('Action', callback);
      },
      function (callback) {
        genreCreate('Comedy', callback);
      },
      function (callback) {
        genreCreate('Horror', callback);
      },
      function (callback) {
        genreCreate('Drama', callback);
      }
    ],
    // optional callback
    cb
  );
}

function createMovies(cb) {
  async.series(
    [
      function (callback) {
        movieCreate(
          'Avengers: Endgame',
          null,
          2019,
          [genres[0], genres[1]],
          'https://images-na.ssl-images-amazon.com/images/I/81V1KTnYKwL._SL1371_.jpg',
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Avengers: Infinity War',
          null,
          2018,
          [genres[0], genres[1]],
          'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_UY1200_CR90,0,630,1200_AL_.jpg',
          callback
        );
      },
      function (callback) {
        movieCreate(
          'I am Legend',
          null,
          2007,
          [genres[3]],
          'https://irs.www.warnerbros.com/keyart-jpeg/movies/media/browser/i_am_legend_key_art.jpg',
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Forest Gump',
          'Life is like a box of chocolates',
          null,
          [genres[4]],
          undefined,
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Teen Titans Go to the Movies',
          null,
          2018,
          [genres[2]],
          'https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/TTG_Movie_Poster_5.jpg/220px-TTG_Movie_Poster_5.jpg',
          callback
        );
      }
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGenres, createMovies],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('movies: ' + movies) + ' genres: ' + genres;
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
