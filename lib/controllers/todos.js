const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeTodoOwnership = require('../middleware/authorizeTodoOwnership');
const { Todo } = require('../models/Todo');


const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const todos = await Todo.getAll(req.user.id);
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const todo = await Todo.insert({ userId: req.user.id, ...req.body });
    res.json(todo);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', [authenticate, authorizeTodoOwnership], async (req, res, next) => {
  try {
    const todo = await Todo.update(req.params.id, req.body);
    res.json(todo);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', [authenticate, authorizeTodoOwnership], async (req, res, next) => {
  try {
    const todo = await Todo.delete(req.params.id);
    res.json(todo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
