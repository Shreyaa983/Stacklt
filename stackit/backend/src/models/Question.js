const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
