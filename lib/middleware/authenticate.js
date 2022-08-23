const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    if(!cookie) throw new HttpError('you must be signed in to continue', 401);

    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
