var Movie = require('../models/movie');
var Genre = require('../models/genre');

var async = require('async');

const { movie, validationResult } = require('express-validator');

// Display list of all Books.
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
