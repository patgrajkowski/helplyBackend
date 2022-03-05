const config = require('config');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.get('/:id/short', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { nickname, score, numberOfRatings, email } = user;
    res.status(200).send({ nickname, score, numberOfRatings, email });
  } catch (error) {
    console.log(error);
    res.status(404).send('Could not fetch user');
  }
});
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validate({ email, password });
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');
    if (!user) user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(201).send('User created');
  } catch (e) {
    res.status(400).send(e._message);
  }
});

module.exports = router;
