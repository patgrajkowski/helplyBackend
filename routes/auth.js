const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const createAccesToken = (user) => {
  return jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    config.get('jwtSecret')
  );
};

const createRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, config.get('refreshSecret'));
};

router.post('/login', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(403).send('Invalid email or password.');
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(403).send('Invalid email or password.');
  const token = createAccesToken(user);
  res.cookie('id', createRefreshToken(user), {
    httpOnly: true,
  });
  res.status(200).send({ token, isAdmin: user.isAdmin });
});
router.post('/logout', async (req, res) => {
  res.cookie('id', '', {
    httpOnly: true,
  });
  res.status(200).send('User has been logout');
});

router.post('/refresh_token', async (req, res) => {
  const token = req.cookies.id;
  let payload;
  if (!token) {
    return res.send({ accessToken: '' });
  }
  try {
    payload = jwt.verify(token, config.get('refreshSecret'));
  } catch (error) {
    console.log(error);
    return res.send({ accessToken: '' });
  }
  const user = await User.findById(payload._id);
  if (!user) {
    return res.send({ accessToken: '' });
  }
  return res.send({ accessToken: createAccesToken(user) });
});

const validate = (req) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  };

  return Joi.validate(req, schema);
};
exports.createAccesToken = createAccesToken;
exports.createRefreshToken = createRefreshToken;
module.exports = router;
