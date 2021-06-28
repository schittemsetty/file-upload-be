var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    match: /.+\@.+\..+/,
    required: true
  },
  password: {
      type: String,
      required: true,
      min: 8,
      max: 16
  },
  date: {
      type: Date,
      default: new Date()
  }
},
{
  timestamps: true
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
