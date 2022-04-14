const { Post, validate } = require("../models/post");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();

// GET

router.get("/all", async (req, res) => {
  if (req.query.limit) {
    if (req.query.category) {
      const posts = await Post.find({ categories: { $in: req.query.category } })
        .sort({ created: 1 })
        .limit(Number(req.query.limit));
      return res.send(posts);
    }
    const posts = await Post.find()
      .sort({ created: 1 })
      .limit(Number(req.query.limit));
    res.send(posts);
  }
});

router.get("/postid/:id", async (req, res) => {
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
// POST

router.post("/", auth, async (req, res) => {
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

router.post("/user/me", auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id });
    res.send(posts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
