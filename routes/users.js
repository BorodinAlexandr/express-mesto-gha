const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  /*   createUser,
  login, */
  changeUserInfo,
  changeUserAvatar,
} = require('../controllers/users');
const { urlRegex } = require('../constants/regEx');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', getUser);
/* router.post('/signup', celebrate({
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
router.post('/signin', celebrate({
  body: Joi.object().keys({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
}), login); */
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
