const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { signIn } = require('../controllers/users');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(3),
    }),
  }),
  signIn,
);

module.exports = router;
