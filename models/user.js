const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model(
  'User',
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      minlength: 5,
      maxlength: 50,
      default: this.email,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      min: 0,
      default: 0,
    },
    numerOfRatings: {
      type: Number,
      min: 0,
      default: 0,
    },
  })
);

function validateUser(user) {
  const schema = {
    nickname: Joi.string().min(5).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    created: Joi.date(),
    avatar: Joi.string(),
    score: Joi.number().min(0),
    numberOfRatings: Joi.number().min(0),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
