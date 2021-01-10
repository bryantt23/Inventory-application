var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String },
  year: { type: Number, min: 1900, max: 2025 },
  genre: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Genre'
      }
    ],
    validate: [arrayLimit, '{PATH} has incorrect number of genres']
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

// https://stackoverflow.com/questions/28514790/how-to-set-limit-for-array-size-in-mongoose-schema
function arrayLimit(val) {
  return val.length >= 1 && val.length <= 5;
}

// https://stackoverflow.com/questions/47134609/how-to-store-url-value-in-mongoose-schema
MovieSchema.path('imageUrl').validate(val => {
  if (val === '') return true;
  return val.match(/^http.*\.(jpeg|jpg|gif|png)$/) != null;
}, 'Invalid URL.');

// Virtual for movie's URL
MovieSchema.virtual('url').get(function () {
  return '/catalog/movie/' + this._id;
});

//Export model
module.exports = mongoose.model('Movie', MovieSchema);
