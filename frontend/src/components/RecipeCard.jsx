import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {recipe.mediaType === 'image' && (
        <img
          src={recipe.mediaUrl}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-md"
        />
      )}
      {recipe.mediaType === 'video' && (
        <video
          src={recipe.mediaUrl}
          controls
          className="w-full h-48 object-cover rounded-md"
        />
      )}
      <h3 className="text-xl font-semibold mt-3">{recipe.title}</h3>
      <p className="text-sm text-gray-600">by {recipe.createdBy.name}</p>
      <Link
        to={`/recipe/${recipe._id}`}
        className="inline-block mt-3 text-blue-600 hover:underline"
      >
        View Recipe
      </Link>
    </div>
  );
};

export default RecipeCard;
