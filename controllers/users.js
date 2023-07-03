const { NODE_ENV, JWT_SECRET } = process.env;

const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { statusOK } = require('../utils/statuses');
const BadRequestError = require('../utils/errors/bad-request-error');
const NotFoundError = require('../utils/errors/not-found-error');
const ConflictError = require('../utils/errors/conflict-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(statusOK).send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(statusOK).send({ data: user });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const id = req.params.userId;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(statusOK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный id'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }

      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
  const options = { expiresIn: '7d' };

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // токен
      const token = jwt.sign({ _id: user._id }, secretKey, options);
      // устанавливаем токен в куки, с httpOnly
      res.cookie('token', token, { httpOnly: true });
      res.status(200).send({ token });
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(statusOK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(statusOK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
