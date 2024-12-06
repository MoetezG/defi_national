const article = require("../models/article");

const getAllArticles = async (req, res) => {
  try {
    const articles = await article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createArticle = async (req, res) => {
  const newArticle = new article(req.body);
  try {
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const existarticle = await article.findById(req.params.id);
    res.status(200).json(existarticle);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const existarticle = await article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(existarticle);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
};
