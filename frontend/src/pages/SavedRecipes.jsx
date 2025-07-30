import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard'; // Ensure this exists or adjust if named differently

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const { data } = await axios.get('http://localhost:5000/api/recipes/saved/all', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        alert('Could not load saved recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Saved Recipes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">You haven't saved any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
