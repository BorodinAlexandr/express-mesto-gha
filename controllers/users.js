const User = require('../models/user');
const { ERROR_CODES } = require('../constants/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(ERROR_CODES.notFound).send({ message: 'Пользователя не существует' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODES.notFound).send({ message: 'Неправильный запрос' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Пользователя не существует' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODES.notFound).send({ message: 'Неправильный запрос' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Пользователя не существует' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};
