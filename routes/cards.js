const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { urlRegex } = require('../constants/regEx');

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).regex(urlRegex),
  }).unknown(true),
}), createCard);
router.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
