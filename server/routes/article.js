const router = require("express").Router();

const auth = require("../middleware/Auth");

const {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require("../controller/article");

router.get("/all", getAllArticles);
router.post("/create", auth, createArticle);
router.get("/:id", getArticleById);
router.put("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);

module.exports = router;
