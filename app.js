require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');
const NotFoundError = require('./utils/errors/not-found-error');

const { PORT = 3000 } = process.env;

// const { createUser, login } = require('./controllers/users');
// const auth = require('./middlewares/auth');

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log('connected to db');
  });

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(routes);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
