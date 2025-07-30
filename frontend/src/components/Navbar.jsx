import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ user, setUser }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/search?q=${search}`);
      setSearch('');
    }
  };

  return (
    <nav className="bg-white shadow p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-purple-600">
          RecipeShare
        </Link>
        <Link to="/saved" className="text-gray-700 hover:text-purple-600 text-sm">
          Saved
        </Link>
        {user && (
          <Link to="/create" className="text-gray-700 hover:text-purple-600 text-sm">
            Share Recipe
          </Link>
        )}
      </div>

      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        className="px-3 py-1 border rounded text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <div className="flex gap-4 text-sm items-center">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-purple-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-purple-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
