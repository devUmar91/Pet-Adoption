import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/petWithfamily.avif'; // Adjust the path


const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-800 text-gray-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Adjust the height as needed
      }}
    >    
      <div
        className={`text-center max-w-lg p-8 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg transition-transform transition-opacity duration-1000 ease-in-out ${
          isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-90'
        }`}
      >
        <h1 className="text-5xl font-extrabold mb-6 text-gray-50">Welcome to Pet Adoption</h1>
        <p className="text-lg mb-8 text-gray-300">Find your perfect companion today!</p>
        <Link
          to="/pets"
          className="bg-blue-500 text-gray-100 px-8 py-4 rounded-lg font-semibold transition-transform transform hover:scale-105 hover:bg-indigo-400"
        >
          Browse Pets
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
