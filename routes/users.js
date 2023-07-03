const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');

const {
  validateUserById,
  validateUpdateUserProfile,
  validateUpdateUserAvatar,
} = require('../middlewares/validator');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/', getUsers);

router.get('/:userId', validateUserById, getUserById);

router.patch('/me', validateUpdateUserProfile, updateUserProfile);

router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = router;
