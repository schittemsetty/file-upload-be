var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  group: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
