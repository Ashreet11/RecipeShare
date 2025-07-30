import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedRecipes from './pages/SavedRecipes';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import RecipeDetails from './pages/RecipeDetails';
import CreateRecipe from './pages/CreateRecipe';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Navbar user={user} setUser={setUser} />

        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/saved" element={<SavedRecipes />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile/:chefId" element={<Profile />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/create" element={<CreateRecipe />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
