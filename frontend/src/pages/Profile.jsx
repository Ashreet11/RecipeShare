import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const Profile = () => {
  const { chefId } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [chefName, setChefName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefRecipes = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/recipes/chef/${chefId}`);
        setRecipes(data);
        if (data.length > 0) setChefName(data[0].createdBy.name);
      } catch (error) {
        console.error('Error loading chef profile:', error);
        alert('Could not load chef profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchChefRecipes();
  }, [chefId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Recipes by {chefName || 'Chef'}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">No recipes found for this chef.</p>
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

export default Profile;
