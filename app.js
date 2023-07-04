require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error-handler');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const routes = require('./routes');
const NotFoundError = require('./utils/errors/not-found-error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  max: 100, // лимит в 100 запросов в минуту (дефолт для windowMs)
});

mongoose
  .connect(DB_URL, {
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
app.use(helmet());
app.use(limiter);

app.use(routes);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
