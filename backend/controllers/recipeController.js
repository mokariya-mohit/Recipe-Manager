const Recipe = require('../models/recipeModel');

// Create a recipe
exports.createRecipe = async (req, res, next) => {
    const { title, ingredients, instructions, cuisineType } = req.body;
    const image = req.file ? req.file.path : '';

    try {
        const newRecipe = new Recipe({
            title,
            ingredients,
            instructions,
            cuisineType,
            author: req.user.username,
            user: req.user._id,
            image
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        next(err);
    }
};

// Get all recipes
exports.getRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find({ user: req.user._id }).select('title ingredients instructions cuisineType author image createdAt');
        res.json(recipes);
    } catch (err) {
        next(err);
    }
};

// Update a recipe
exports.updateRecipe = async (req, res, next) => {
    const { title, ingredients, instructions, cuisineType } = req.body;
    const image = req.file ? req.file.path : undefined;

    try {
        const recipe = await Recipe.findById(req.params.id);

        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        recipe.title = title || recipe.title;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.cuisineType = cuisineType || recipe.cuisineType;
        if (image) {
            recipe.image = image;
        }

        await recipe.save();
        res.json(recipe);
    } catch (err) {
        next(err);
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await recipe.remove();
        res.json({ message: 'Recipe removed' });
    } catch (err) {
        next(err);
    }
};
