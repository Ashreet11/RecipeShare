import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchRecipe = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(data);

      const loggedUser = JSON.parse(localStorage.getItem('userInfo'));
      if (loggedUser) {
        const isAlreadySaved = data.savedBy?.includes(loggedUser._id);
        setIsSaved(isAlreadySaved);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirm) return;

    try {
      const token = user?.token;
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Recipe deleted');
      navigate('/');
    } catch (error) {
      alert('Error deleting recipe');
      console.error(error);
    }
  };

  const toggleSave = async () => {
    try {
      const token = user?.token;
      const { data } = await axios.post(
        `http://localhost:5000/api/recipes/${id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved((prev) => !prev);
      alert(data.message);
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Something went wrong while saving the recipe');
    }
  };

  const goToChefProfile = () => {
    navigate(`/profile/${recipe.createdBy._id}`);
  };

  if (!recipe) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-600 mb-4">{recipe.description}</p>

      {recipe.mediaUrl && (
        recipe.mediaType === 'image' ? (
          <img src={recipe.mediaUrl} alt="Recipe" className="w-full rounded mb-4 object-cover max-h-[400px]" />
        ) : (
          <video controls className="w-full rounded mb-4 max-h-[400px]">
            <source src={recipe.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      )}

      <div className="mb-4">
        <h4 className="font-semibold">Ingredients:</h4>
        <ul className="list-disc list-inside">
          {recipe.ingredients?.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Steps:</h4>
        <ol className="list-decimal list-inside">
          {recipe.steps?.map((item, idx) => <li key={idx}>{item}</li>)}
        </ol>
      </div>

      {/* 👇 Navigable creator name */}
      <p className="text-sm text-gray-500 mt-4">
        Created by:{' '}
        <button onClick={goToChefProfile} className="text-purple-600 hover:underline">
          {recipe.createdBy?.name}
        </button>
      </p>

      {user && (
        <div className="flex gap-3 mt-4">
          {recipe.createdBy?._id === user._id && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Recipe
            </button>
          )}
          <button
            onClick={toggleSave}
            className={`text-white px-4 py-2 rounded ${isSaved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isSaved ? 'Unsave' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
