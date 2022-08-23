const { Router } = require('express');
const { UserService } = require('../services/UserService');

const ONE_DAY_IN_MS = 3600 * 24 * 1000;

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);
    const token = await UserService.signIn(req.body);

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIES === 'true',
      sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
      maxAge: ONE_DAY_IN_MS
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/sessions', async (req, res, next) => {
  try {
    const token = await UserService.signIn(req.body);

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIES === 'true',
      sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
      maxAge: ONE_DAY_IN_MS
    });

    res.status(204);
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
