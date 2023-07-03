const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const { statusOK } = require('../utils/statuses');
const BadRequestError = require('../utils/errors/bad-request-error');
const ForbiddenError = require('../utils/errors/forbidden-error');
const NotFoundError = require('../utils/errors/not-found-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      next(err);
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      }
      return Card.deleteOne(card);
    })
    .then(() => res.status(statusOK).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Невалидный id'));
        return;
      }
      next(err);
    });
};

const putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      } else {
        res.status(statusOK).send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      }
      next(err);
    });
};

const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(
          new BadRequestError('Переданы некорректные данные для снятия лайка'),
        );
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
