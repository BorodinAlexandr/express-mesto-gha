const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  createUser,
  changeUserInfo,
  changeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.post('/', celebrate({
  body: Joi.object().keys({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().min(2),
    }).unknown(true),
  }),
}), createUser);
router.patch('/me', changeUserInfo);
router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
