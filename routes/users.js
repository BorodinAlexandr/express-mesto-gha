const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  changeUserInfo,
  changeUserAvatar,
} = require('../controllers/users');
const { urlRegex } = require('../constants/regEx');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), changeUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).regex(urlRegex),
  }),
}), changeUserAvatar);

module.exports = router;
