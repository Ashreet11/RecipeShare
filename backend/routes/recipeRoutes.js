import express from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe,
  searchRecipes,
  getRecipesByChef,
  toggleSaveRecipe,
  getSavedRecipes,
} from '../controllers/recipeController.js';

import protect from '../middleware/authMiddleware.js'; // ✅ Correct import
import upload from '../middleware/upload.js';           // ✅ Correct import

const router = express.Router();

// Public routes
router.get('/', getAllRecipes); // All recipes
router.get('/search', searchRecipes); // ?q=searchterm
router.get('/:id', getRecipeById); // Single recipe by ID
router.get('/chef/:chefId', getRecipesByChef); // Recipes by a specific chef

// Protected routes
router.post('/', protect, upload.single('media'), createRecipe); // Create recipe
router.delete('/:id', protect, deleteRecipe); // Delete own recipe
router.post('/:id/save', protect, toggleSaveRecipe); // Save/unsave toggle
router.get('/saved/all', protect, getSavedRecipes); // Get saved recipes

export default router;
