var Movie = require('../models/movie');
var Genre = require('../models/genre');

var async = require('async');

const { movie, validationResult } = require('express-validator');

// Display list of all Movies.
exports.movie_list = function (req, res, next) {
  Movie.find({}, 'title summary year imageUrl')
    .populate('genre')
    .exec(function (err, list_movies) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render('movie_list', {
        title: 'Movie List',
        movie_list: list_movies
      });
    });
};

// Display detail page for a specific movie.
exports.movie_detail = function (req, res, next) {
  async.parallel(
    {
      movie: function (callback) {
        Movie.findById(req.params.id).populate('genre').exec(callback);
      }
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.movie == null) {
        // No results.
        var err = new Error('Movie not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('movie_detail', {
        title: results.movie.title,
        movie: results.movie,
        movie_instances: results.movie_instance
      });
    }
  );
};
