const express = require('express');
const { createRecipe, getRecipes, updateRecipe, deleteRecipe } = require('../controllers/recipeController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, createRecipe);
router.get('/', protect, getRecipes);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
