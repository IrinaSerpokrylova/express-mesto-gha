const { celebrate, Joi } = require('celebrate');

module.exports.validateUserById = celebrate({
  params: Joi.object().keys({
    // здесь и далее: можно проверить что это ObjectID через импорт
    // специальной библиотеки, а можно — через проверку,
    // что все 24 симовла — часть шестнадцатиричной системы
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .uri({ scheme: ['http', 'https'] }),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .uri({ scheme: ['http', 'https'] }),
  }),
});

module.exports.validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
