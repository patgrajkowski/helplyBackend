const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Post = mongoose.model(
  'Posts',
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 50,
      required: true,
    },
    price: {
      type: Number,
      min: 10,
      required: true,
    },
    time: {
      type: Number,
      min: 10,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    level: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      max: 10000,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  })
);
function validatePost(post) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    price: Joi.number().min(10).required(),
    time: Joi.number().min(10).required(),
    categories: Joi.array().required(),
    level: Joi.array().required(),
    description: Joi.string().max(10000).required(),
    created: Joi.date(),
    userId: Joi.objectId().required(),
  };
  return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;
