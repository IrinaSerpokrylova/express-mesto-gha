const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

  if (
    (!authorization || !authorization.startsWith('Bearer ')) &&
    !req.cookies.token
  ) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = req.cookies.token || authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
