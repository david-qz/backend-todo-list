const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Built in middleware
app.use(cookieParser());
app.use(express.json());

// App routes

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
