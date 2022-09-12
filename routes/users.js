const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  changeUserInfo,
  changeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', changeUserInfo);
router.post('/me/avatar', changeUserAvatar);

module.exports = router;
