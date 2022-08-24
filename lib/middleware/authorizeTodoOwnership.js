const { Todo } = require('../models/Todo');
const HttpError = require('../utils/HttpError');

module.exports = async (req, res, next) => {
  const todo = await Todo.getById(req.params.id);
  if (todo.userId === req.user.id) {
    next();
    return;
  }

  next(new HttpError('forbidden', 403));
};
