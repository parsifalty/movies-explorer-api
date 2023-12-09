const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { signUp } = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(3),
      })
      .unknown(true),
  }),
  signUp,
);

module.exports = router;
