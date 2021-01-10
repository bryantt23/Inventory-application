var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreInstanceSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 20 }
});

// Virtual for book's URL
GenreInstanceSchema.virtual('url').get(function () {
  return '/genre/' + this._id;
});

//Export model
module.exports = mongoose.model('Genre', GenreInstanceSchema);
