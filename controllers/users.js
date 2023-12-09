const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { SUCCESS_STATUS, CREATED_STATUS } = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не был найден'));
      }
      return res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.editCurrentUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: 'true', runValidators: true },
  )
    .then((user) => res.status(SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка'));
      } else if (err.name === 11000) {
        next(new ConflictError('Аользователь с такой почтой уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.signUp = (req, res, next) => {
  const { name, password, email } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED_STATUS).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Такая почта уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.signIn = (req, res, next) => {
  const { password, email } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({
        token,
      });
    })
    .catch((err) => {
      next(err);
    });
};
