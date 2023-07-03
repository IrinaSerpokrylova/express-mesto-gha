const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { createUser, login } = require('../controllers/users');
const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validator');
const auth = require('../middlewares/auth');

router.get('/', auth, (req, res) => {
  res.send('Hello World');
});

// роуты, не требующие авторизации (регистрация и логин)
router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

module.exports = router;
