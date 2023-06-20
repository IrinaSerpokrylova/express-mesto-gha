const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const {
  badRequestError,
  notFoundError,
  internalServerError,
  statusOK,
} = require('../utils/statuses');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(statusOK).send(users);
    })
    .catch(() => {
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
      next();
    });
};

const getUserById = (req, res) => {
  const id = req.params.userId;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(notFoundError)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(statusOK).send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequestError).send({
          message: 'Передан некорректный id',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(notFoundError)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(notFoundError)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
