const Card = require('../models/card');
const { ERROR_CODES } = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODES.notFound).send({ message: 'Карточки не существует' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODES.notFound).send({ message: 'Карточки не существует' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODES.notFound).send({ message: 'Карточки не существует' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODES.badRequest).send({ message: 'Неправильный запрос' });
      } else {
        res.status(ERROR_CODES.internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};
