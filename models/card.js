const mongoose = require('mongoose');
const { urlRegex } = require('../constants/regEx');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: mongoose.Schema.Types.Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cardSchema.path('link').validate((val) => urlRegex.test(val), 'Неправильная ссылка');

module.exports = mongoose.model('card', cardSchema);
