const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { createUser, login } = require('../controllers/users');
const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validator');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/not-found-error');

// роуты, не требующие авторизации (регистрация и логин)
router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
