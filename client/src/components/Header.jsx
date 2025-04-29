import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-richblack-800 shadow-lg w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center text-2xl sm:text-3xl font-bold text-richblack-25">
          Collegiate
          <span className="ml-1 text-richblack-25">Mart</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="bg-slate-100 rounded-full p-2 px-4 flex items-center w-40 sm:w-64">
          <input
            type="text"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-sm sm:text-base text-black"
          />
          <button type="submit">
            <IoSearch className="text-slate-600 ml-2 cursor-pointer hover:text-slate-800 transition duration-200" />
          </button>
        </form>

        {/* Navigation and Profile */}
        <ul className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base font-semibold text-richblack-100">
          <li className="hidden sm:inline hover:text-white transition duration-200">
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li className="hidden sm:inline hover:text-white transition duration-200">
            <Link to="/about" className="hover:underline">About</Link>
          </li>
          <li>
            <Link to={currentUser ? "/profile" : "/sign-in"} className="flex items-center">
              {currentUser ? (
                <img
                  className="rounded-full h-10 w-10 object-cover border-2 border-blue-400 hover:scale-105 transition duration-300"
                  src={currentUser.avatar}
                  alt="Profile"
                />
              ) : (
                <button className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-full text-sm transition duration-300">
                  Sign In
                </button>
              )}
            </Link>
          </li>
        </ul>
      </div>

      {/* Decorative Border */}
      <div className="bg-richblack-900 h-1 w-full"></div>
    </header>
  );
}

