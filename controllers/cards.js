const Card = require('../models/card');
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const InternalServerError = require('../errors/serverError');
const NotForbiddenError = require('../errors/notForbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточки не существует');
      }
      if (req.user._id !== card.owner.toString()) {
        throw new NotForbiddenError('Нет доступа');
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      } else if (err.statusCode !== 404 && err.statusCode !== 403) {
        throw new InternalServerError('Произошла ошибка');
      } else {
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Некорректные данные');
      } else {
        throw new InternalServerError('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточки не существует');
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      } else if (err.statusCode !== 404) {
        throw new InternalServerError('Произошла ошибка');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточки не существует');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      } else if (err.statusCode !== 404) {
        throw new InternalServerError('Произошла ошибка');
      } else {
        next(err);
      }
    })
    .catch(next);
};
