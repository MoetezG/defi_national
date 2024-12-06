const router = require("express").Router();
const auth = require("../middleware/Auth");

const {
  getAllQuizzes,
  generateQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  createQuiz,
} = require("../controller/quiz");

router.post("/generateQuiz", generateQuiz);
router.get("/all", getAllQuizzes);
router.post("/create", auth, createQuiz);
router.get("/:id", getQuizById);
router.put("/:id", auth, updateQuiz);
router.delete("/:id", auth, deleteQuiz);

module.exports = router;
