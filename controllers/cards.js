const Card = require('../models/card');

const {
  badRequestError,
  notFoundError,
  internalServerError,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res.status(internalServerError).send({ message: 'Произошла ошибка' }),
    );
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(notFoundError)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({
          message: 'Передан некорректный id карточки',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
