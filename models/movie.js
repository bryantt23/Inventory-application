var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String },
  year: { type: Number, min: 1900, max: 2025 },
  genre: {
    type: Schema.Types.ObjectId,
    ref: 'Genre'
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

// https://stackoverflow.com/questions/47134609/how-to-store-url-value-in-mongoose-schema
MovieSchema.path('imageUrl').validate(val => {
  urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(val);
}, 'Invalid URL.');

// Virtual for movie's URL
MovieSchema.virtual('url').get(function () {
  return '/catalog/movie/' + this._id;
});

//Export model
module.exports = mongoose.model('Movie', MovieSchema);
