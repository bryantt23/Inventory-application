var Movie = require('../models/movie');
var Genre = require('../models/genre');

var async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all Movies.
exports.movie_list = function (req, res, next) {
  Movie.find({}, 'title summary year imageUrl genre')
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
        movie: results.movie
      });
    }
  );
};

// Display detail page for a specific movie.
exports.movie_delete_get = function (req, res, next) {
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
      res.render('movie_delete', {
        title: results.movie.title,
        movie: results.movie
      });
    }
  );
};

// Display detail page for a specific movie.
exports.movie_delete_post = function (req, res, next) {
  async.parallel(
    {
      movie: function (callback) {
        Movie.findById(req.params.id).exec(callback);
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
      Movie.findByIdAndRemove(req.body.movieid, function deleteMovie(err) {
        if (err) {
          return next(err);
        }
        // Success - go to movies list
        res.redirect('/catalog/movies');
      });
    }
  );
};

// Display detail page for a specific movie.
exports.movie_update_get = function (req, res, next) {
  async.parallel(
    {
      movie: function (callback) {
        Movie.findById(req.params.id).populate('genre').exec(callback);
      },
      genres: function (callback) {
        Genre.find({})
          .sort([['name', 'ascending']])
          .exec(callback);
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
      res.render('movie_update', {
        title: results.movie.title,
        movie: results.movie,
        genres: results.genres
      });
    }
  );
};

// Display detail page for a specific movie.
exports.movie_update_post = [
  // Validate and sanitise fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('year', 'Year must be must be between 1900 and 2025')
    .isDecimal({ min: 1900, max: 2025 })
    .escape(),
  body('summary').isString().escape(),
  body('imageurl').isString(),
  body('genres').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    var movie = new Movie({
      title: req.body.title,
      year: req.body.year,
      summary: req.body.summary,
      imageUrl: req.body.imageurl,
      genre: req.body.genres,
      _id: req.params.id //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(function (err, results) {
        if (err) {
          return next(err);
        }
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Movie.findByIdAndUpdate(
        req.params.id,
        movie,
        {},
        function (err, themovie) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(themovie.url);
        }
      );
    }
  }
];
