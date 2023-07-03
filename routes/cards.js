const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardById,
} = require('../middlewares/validator');

router.get('/', getCards);

router.post('/', validateCreateCard, createCard);

router.delete('/:cardId', validateCardById, deleteCardById);

router.put('/:cardId/likes', validateCardById, putCardLike);

router.delete('/:cardId/likes', validateCardById, deleteCardLike);

module.exports = router;
