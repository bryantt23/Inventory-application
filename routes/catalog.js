var express = require('express');
var router = express.Router();

// Require controller modules.
var movie_controller = require('../controllers/movieController');
// var genre_controller = require('../controllers/genreController');

// GET request for creating a Movie. NOTE This must come before routes that display Book (uses id).
router.get('/movie/create', movie_controller.movie_create_get);

// POST request for creating Movie.
router.post('/movie/create', movie_controller.movie_create_post);

// GET request for list of all Movie items.
router.get('/movies', movie_controller.movie_list);

// GET request for one Movie.
router.get('/movie/:id', movie_controller.movie_detail);

// GET request to delete Movie.
router.get('/movie/:id/delete', movie_controller.movie_delete_get);

// POST request to delete Movie.
router.post('/movie/:id/delete', movie_controller.movie_delete_post);

// GET request to update Movie.
router.get('/movie/:id/update', movie_controller.movie_update_get);

// POST request to update Movie.
router.post('/movie/:id', movie_controller.movie_update_post);

module.exports = router;
