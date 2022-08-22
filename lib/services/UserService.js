const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const HttpError = require('../utils/HttpError');

const UserService = {};

UserService.create = async function({ email, password }) {
  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  try {
    return await User.insert({ email, passwordHash });
  } catch (error) {
    if (error.message.match(/violates unique constraint "users_email_key"/)) {
      throw new HttpError('username already in use', 409);
    } else {
      throw error;
    }
  }
};

UserService.signIn = async function({ email, password }) {
  const user = await User.getByEmail(email);
  if (!user) throw new HttpError('invalid email/password', 401);

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    throw new HttpError('invalid email/password', 401);
  }

  return jwt.sign(user.toToken(), process.env.JWT_SECRET, {
    expiresIn: '1 day',
  });
};

module.exports = { UserService };
