import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [media, setMedia] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('media', media);

    // Convert to arrays properly
    const ingredientsArray = ingredientsText
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    const stepsArray = stepsText
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item);

    // Append each array item to formData
    ingredientsArray.forEach((item) => formData.append('ingredients[]', item));
    stepsArray.forEach((item) => formData.append('steps[]', item));

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      const res = await axios.post('http://localhost:5000/api/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Recipe created!');
      navigate(`/recipe/${res.data._id}`);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Error creating recipe');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Share a New Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
        <textarea
          placeholder="Ingredients (comma-separated)"
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
        <textarea
          placeholder="Steps (one per line)"
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
        <input
          type="file"
          onChange={(e) => setMedia(e.target.files[0])}
          className="w-full"
          accept="image/*,video/*"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
