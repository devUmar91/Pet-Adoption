import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Ensure this is installed
import { UserContext } from '../Context/context'; // Assuming this is where your context is

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const [petDetails, setPetDetails] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    image: '',
    contact: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchedToken = Cookies.get('token');
    console.log('Fetched Token:', fetchedToken); // Log the fetched token
    if (fetchedToken) {
      setToken(fetchedToken);
    }
  }, []);

  console.log('Headers:', {
    Authorization: `Bearer ${token}`
  });
  
  

  const handleInputChange = (e) => {
    setPetDetails({
      ...petDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetDetails((prevState) => ({
          ...prevState,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Token before submission:', token); // Check token before use
    console.log('Pet Details:', petDetails); // Log pet details
  
    if (!token) {
      alert('You are not authenticated! Please log in.');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      console.log('Making request with headers:', {
        Authorization: `Bearer ${token}`
      });
  
      const response = await axios.post('http://localhost:3000/pets/post', petDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      alert(response.data.message);
      setPetDetails({
        name: '',
        breed: '',
        age: '',
        description: '',
        image: '',
        contact: '',
      });
      console.log(response);
      
    } catch (error) {
      console.error("Error submitting pet:", error.response ? error.response.data : error.message);
      alert('Error submitting pet. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-200 py-[90px] px-7">
      <div className="max-w-2xl mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-indigo-400 mb-4 text-center">Add a Pet</h2>
        <form onSubmit={handleFormSubmit} className="space-y-3">
          {/* Pet Name */}
          <div>
            <label className="block text-gray-300 mb-1">Pet Name:</label>
            <input
              type="text"
              name="name"
              value={petDetails.name}
              onChange={handleInputChange}
              className="w-full p-1 bg-gray-600 outline-none text-gray-200 rounded-lg"
              required
            />
          </div>

          {/* Breed */}
          <div>
            <label className="block text-gray-300 mb-1">Breed:</label>
            <input
              type="text"
              name="breed"
              value={petDetails.breed}
              onChange={handleInputChange}
              className="w-full p-1 bg-gray-600 outline-none text-gray-200 rounded-lg"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-300 mb-1">Age:</label>
            <input
              type="text"
              name="age"
              value={petDetails.age}
              onChange={handleInputChange}
              className="w-full p-1 bg-gray-600 outline-none text-gray-200 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-1">Description:</label>
            <textarea
              name="description"
              value={petDetails.description}
              onChange={handleInputChange}
              className="w-full p-1 h-9 bg-gray-600 outline-none text-gray-200 rounded-lg"
              rows="3"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-300 mb-1">Image URL or Upload Image:</label>
            <input
              type="text"
              name="image"
              value={petDetails.image}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              className="w-full p-1 bg-gray-600 outline-none text-gray-200 rounded-lg mb-2"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full bg-gray-600 outline-none text-gray-200 rounded-lg"
            />
          </div>

          {/* WhatsApp Contact Number */}
          <div>
            <label className="block text-gray-300 mb-1">WhatsApp Contact:</label>
            <input
              type="text"
              name="contact"
              value={petDetails.contact}
              onChange={handleInputChange}
              placeholder="Enter WhatsApp number"
              className="w-full p-1 bg-gray-600 outline-none text-gray-200 rounded-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white px-4 py-1 rounded-lg font-semibold transition-colors duration-300 hover:bg-indigo-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Add Pet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
