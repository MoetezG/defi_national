const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
  categories: {
    type: Number,
  },
  question: {
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
