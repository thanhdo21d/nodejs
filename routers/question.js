const express = require("express");
const router = express.Router();
const Question = require("./models/question");

router.post("/question", async (req, res) => {
  const { content, options, answer, categoryId } = req.body;

  const newQuestion = new Question({
    content: content,
    options: options,
    answer: answer,
    category: categoryId,
  });

  try {
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/questions/:categoryId", async (req, res) => {
  try {
    const questions = await Question.find({ category: req.params.categoryId });
    res.json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
