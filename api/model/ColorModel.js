var mongoose = require('mongoose');

var ColorSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

var Color = mongoose.model('Color', ColorSchema);
module.exports = Color;
