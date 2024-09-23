const Recipe = require('../models/recipeModel');

// Create a recipe
exports.createRecipe = async (req, res) => {
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
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all recipes
exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user._id });
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
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
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        // Find the recipe by ID and delete it
        const recipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json({ message: 'Recipe Deleted' });
    } catch (err) {
        console.error(err); // Log the error details for debugging
        res.status(500).json({ message: 'Server error' });
    }
};

