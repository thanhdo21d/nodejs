const express = require("express");
const router = express.Router();
const Category = require("../models/modes");

router.post("/category", async (req, res) => {
  const { name, parentId } = req.body;
  const newCategory = new Category({
    name: name,
    parent: parentId,
  });
  try {
    await newCategory.save();
    if (parentId) {
      await Category.findByIdAndUpdate(parentId, {
        $push: { children: newCategory._id },
      });
    }
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
async function getCategoryTree(categoryId) {
  const category = await Category.findById(categoryId).populate("children");
  if (category.children && category.children.length > 0) {
    for (let i = 0; i < category.children.length; i++) {
      category.children[i] = await getCategoryTree(category.children[i]._id);
    }
  }
  return category;
}
router.get("/category-tree/:categoryId", async (req, res) => {
  try {
    const tree = await getCategoryTree(req.params.categoryId);
    res.json(tree);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
