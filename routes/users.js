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
router.patch('/me/avatar', changeUserAvatar);
router.get('*', (req, res) => {
  res.send(res.status(404).send({ message: '404 not found' }));
});

module.exports = router;
