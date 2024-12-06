const quiz = require("../models/quiz");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config(); // Corrected dotenv config loading

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateQuiz = async (req, res) => {
  const prompt = `
    Create a quiz on the topic: "Et si l’océan était un corps humain?" with one question.
    Each question should have 4 options, and one of them must be correct. Format the output as JSON:
    {
      "categories": ["Ocean"],
      "question": {
        "questionText": "Si l’océan était un corps humain, quel organe pourrait-il représenter?",
        "options": [
          { "text": "Le cerveau", "isCorrect": false },
          { "text": "Le foie", "isCorrect": false },
          { "text": "Les poumons", "isCorrect": true },
          { "text": "Le cœur", "isCorrect": false }
        ]
      }
    }
`;

  try {
    let retries = 5;
    let delay = 1000; // Initial delay
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000, // Reduced token count to limit response size
            temperature: 0.7, // Reduced temperature for more deterministic results
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );
        console.log(
          "Response from OpenAI:",
          response.data.choices[0].message.content
        );
        const generatedQuiz = JSON.parse(
          response.data.choices[0].message.content
        );
        function extractJsonContent(generatedQuiz) {
          const match = response.match(/\{.*\}/s); // Regular expression to match everything from the first `{` to the last `}`
          return match ? match[0] : null;
        }
        console.log("Extracted JSON content:", extractJsonContent);
        const Quiz = new quiz({
          categories: "Ocean",
          questions: extractJsonContent,
        });

        await Quiz.save();
        return res.status(200).json(generatedQuiz); // Send the generated quiz as response
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.response?.data);
        if (error.response?.status === 429) {
          console.log(
            `Rate limit exceeded. Retrying in ${delay / 1000} seconds...`
          );
          await sleep(delay);
          delay *= 2; // Exponential backoff
        } else {
          console.error("Error generating quiz:", error.message);
          return res.status(500).json({
            error: "Failed to generate the quiz",
            message: error.message,
          });
        }
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
    res.status(500).json({ error: "Failed to generate the quiz" });
  }
};

const createQuiz = async (req, res) => {
  const newQuiz = new quiz(req.body);
  try {
    const quiz = await newQuiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const existquiz = await quiz.findById(req.params.id);
    res.status(200).json(existquiz);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const existquiz = await quiz.findById(req.params.id);
    if (!existquiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    await existquiz.updateOne(req.body);
    res.status(200).json("Quiz updated successfully");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    await quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllQuizzes,
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  generateQuiz,
};
