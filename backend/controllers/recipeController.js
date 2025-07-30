import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

export const createRecipe = async (req, res) => {
  try {
    let mediaUrl = '';
    let mediaType = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto',
      });
      mediaUrl = result.secure_url;
      mediaType = result.resource_type;
      fs.unlinkSync(req.file.path);
    }

    const recipe = await Recipe.create({
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      mediaUrl,
      mediaType,
      createdBy: req.user._id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchRecipes = async (req, res) => {
  try {
    const query = req.query.q;
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).populate('createdBy', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecipesByChef = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.params.chefId }).populate('createdBy', 'name');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSaveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!recipe || !user) {
      return res.status(404).json({ message: 'Recipe or User not found' });
    }

    const alreadySaved = recipe.savedBy.includes(user._id.toString());

    if (alreadySaved) {
      recipe.savedBy = recipe.savedBy.filter(id => id.toString() !== user._id.toString());
      user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipe._id.toString());
    } else {
      recipe.savedBy.push(user._id);
      user.savedRecipes.push(recipe._id);
    }

    await recipe.save();
    await user.save(); // 🔥 This ensures the user document is updated

    res.json({
      message: alreadySaved ? 'Recipe unsaved' : 'Recipe saved',
      savedBy: recipe.savedBy,
    });
  } catch (error) {
    console.error('Error in toggleSaveRecipe:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedRecipes',
      populate: { path: 'createdBy', select: 'name' },
    });

    res.json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};