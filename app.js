/* const path = require("path"); */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '631e2a1ebab6ce16fcd871e2',
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.patch('*', (req, res) => {
  res.status(404).send({ message: 'Что-то пошло не так...' });
});

app.listen(PORT, () => {
  /* console.log(PORT);
  console.log(BASE_PATH); */
});
