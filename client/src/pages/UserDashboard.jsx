import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserContext } from '../Context/context';

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const [userPosts, setUserPosts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');

  const [petDetails, setPetDetails] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    contact: '',
    city: '',
    category: '',
    images: [],
  });

  const predefinedCategories = [
    'Dog', 'Cat', 'Bird', 'Reptile', 'Small Animal', 
    'Fish', 'Horse', 'Farm Animal', 'Rodent', 'Exotic Animal', 
    'Insect', 'Others'
  ];

  useEffect(() => {
    const fetchedToken = Cookies.get('token');
    if (fetchedToken) setToken(fetchedToken);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetDetails({ ...petDetails, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setPetDetails({ ...petDetails, category: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((images) => {
        setPetDetails((prevState) => ({ ...prevState, images }));
      })
      .catch((error) => console.error("Error reading images:", error));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You are not authenticated! Please log in.');
      return;
    }

    const isAnyFieldEmpty = Object.values(petDetails).some(
      (value) => value === '' || (Array.isArray(value) && value.length === 0)
    );
    if (isAnyFieldEmpty) {
      alert('Please fill all fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Attach userId to the request payload
      const payload = { ...petDetails, userId: user?._id };

      const response = await axios.post(
        'http://localhost:3000/pets/post',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setPetDetails({
        name: '',
        breed: '',
        age: '',
        description: '',
        contact: '',
        city: '',
        category: '',
        images: [],
      });

    } catch (error) {
      console.error("Error submitting pet:", error);
      alert('Error submitting pet. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 mt-10 md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-2">Your Info</h3>
            <p className="text-gray-300">Name: {user?.name}</p>
            <p className="text-gray-300">Email: {user?.email}</p>
            <p className="text-gray-300">Contact: {user?.contact}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-indigo-400 mb-4 text-center">Add a Pet</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Pet Name:</label>
              <input
                type="text"
                name="name"
                value={petDetails.name}
                onChange={handleInputChange}
                className="w-full p-2 capitalize bg-gray-600 outline-none text-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Breed:</label>
              <input
                type="text"
                name="breed"
                value={petDetails.breed}
                onChange={handleInputChange}
                className="w-full p-2 capitalize bg-gray-600 outline-none text-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Age:</label>
              <input
                type="text"
                name="age"
                value={petDetails.age}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-600 outline-none text-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">City:</label>
              <input
                type="text"
                name="city"
                value={petDetails.city}
                onChange={handleInputChange}
                className="w-full p-2 capitalize bg-gray-600 outline-none text-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Category:</label>
              <select
                value={petDetails.category}
                onChange={handleCategoryChange}
                className="w-full p-2 capitalize bg-gray-600 outline-none text-gray-200 rounded-lg"
              >
                <option value="" disabled>Select a category</option>
                {predefinedCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Description:</label>
              <textarea
                name="description"
                value={petDetails.description}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-600 outline-none text-gray-200 rounded-lg"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Contact:</label>
              <input
                type="tel"
                name="contact"
                value={petDetails.contact}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-600 outline-none text-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Upload Images:</label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="block text-gray-300 bg-gray-600 outline-none rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 text-lg font-semibold ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-500'} text-white rounded-lg`}
            >
              {isSubmitting ? 'Submitting...' : 'Add Pet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
