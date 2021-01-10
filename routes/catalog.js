var express = require('express');
var router = express.Router();

// Require controller modules.
var movie_controller = require('../controllers/movieController');
// var genre_controller = require('../controllers/genreController');

// GET request for list of all Book items.
router.get('/movies', movie_controller.movie_list);

module.exports = router;
