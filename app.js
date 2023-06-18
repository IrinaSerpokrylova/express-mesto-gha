const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routesCard = require('./routes/cards');
const routesUsers = require('./routes/users');
const { notFoundError } = require('./utils/errors');

const { PORT = 3000 } = process.env;

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

app.use((req, res, next) => {
  req.user = {
    _id: '648dd61dc4c4ead7281f98fa', //  _id созданного пользователя
  };

  next();
});

app.use(routesUsers);
app.use('/cards', routesCard);

app.get('*', (req, res) => {
  res.status(notFoundError).send({ message: 'Ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
