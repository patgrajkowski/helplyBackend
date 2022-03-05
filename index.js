const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const posts = require('./routes/posts');
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(
  cors({
    origin: ['https://helply.vercel.app', 'http://localhost:3000'],
    credentials: true,
  })
);
mongoose
  .connect(config.get('mongoUrl'))
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...'));
app.use(express.json());
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use(cookieParser());
app.use('/api/auth', auth);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));
