const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const InternalServerError = require('../errors/serverError');
const NewUserCreateError = require('../errors/newUserError');
const NotValidTokenError = require('../errors/notValidToken');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный id');
      } else {
        throw new InternalServerError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send(user.toObject());
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        throw new NewUserCreateError('Пользователь с такой почтой уже существует');
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные');
      } else {
        throw new InternalServerError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).select('+password')
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'Boris-Razor', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      throw new NotValidTokenError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Некорректный id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные');
      } else {
        throw new InternalServerError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Некорректный id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные');
      } else {
        throw new InternalServerError('Произошла ошибка');
      }
    })
    .catch(next);
};
