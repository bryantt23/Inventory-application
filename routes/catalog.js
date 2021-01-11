var express = require('express');
var router = express.Router();

// Require controller modules.
var movie_controller = require('../controllers/movieController');
// var genre_controller = require('../controllers/genreController');

// GET request for list of all Movie items.
router.get('/movies', movie_controller.movie_list);

// GET request for one Movie.
router.get('/movie/:id', movie_controller.movie_detail);

module.exports = router;
