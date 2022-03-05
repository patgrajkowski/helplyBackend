const { Post, validate } = require('../models/post');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
  console.log(req.query.limit);
  const posts = req.query.limit
    ? await Post.find().sort({ created: 1 }).limit(Number(req.query.limit))
    : await Post.find().sort({ created: 1 });
  res.send(posts);
});

router.get('/:id', async (req, res) => {
  try {
    const { title, price, time, categories, level, description, userId } =
      await Post.findById(req.params.id);
    const { nickname, avatar, email, score, numberOfRatings } =
      await User.findById(userId);
    res.status(200).send({
      title,
      price,
      time,
      categories,
      level,
      description,
      nickname,
      avatar,
      email,
      score,
      numberOfRatings,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', auth, async (req, res) => {
  const { title, price, time, categories, level, description } = req.body;
  try {
    const { error } = validate({
      title,
      price,
      time,
      categories,
      level,
      description,
      userId: req.user._id,
    });
    const post = new Post({
      title,
      price,
      time,
      categories,
      level,
      description,
      userId: req.user._id,
    });
    await post.save();
    res.status(201).send(post._id);
  } catch (e) {
    res.status(400).send(e._message);
  }
});

module.exports = router;
