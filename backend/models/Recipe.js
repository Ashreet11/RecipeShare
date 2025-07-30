import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
    },
    ingredients: [String],
    steps: [String],
    mediaUrl: {
      type: String, // Cloudinary URL
    },
    mediaType: {
      type: String, // 'image' or 'video'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ], // Array of user IDs who saved the recipe
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
