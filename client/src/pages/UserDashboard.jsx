import React, { useContext, useState } from 'react';
import { usePets } from '../Context/context'; // Adjust the import based on your file structure
import { UserContext } from '../Context/context';

const UserDashboard = () => {
  const { addPet } = usePets(); // Get addPet from context
  const {user}=useContext(UserContext)
  console.log(user?.isAdmin);
  
  const [petDetails, setPetDetails] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    image: '',
    whatsappNumber: '',
    countryCode: '+1', // Default country code (USA)
  });

  const countryCodes = [
    { code: '+92', country: 'Pakistan'}
    // Add more country codes as needed
  ];

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!petDetails.name || !petDetails.breed || !petDetails.age || !petDetails.description || !petDetails.whatsappNumber) {
      alert('Please fill in all required fields!');
      return;
    }
    const newPet = {
      ...petDetails,
      adoptionStatus: 'Available', // Default status for new pets
    };
    addPet(newPet); // Add pet using context function
    setPetDetails({
      name: '',
      breed: '',
      age: '',
      description: '',
      image: '',
      whatsappNumber: '',
      countryCode: '+1', // Reset to default
    });
    alert('Pet added successfully!');
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
              className="w-full p-1 bg-gray-600 text-gray-200 rounded-lg"
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
              className="w-full p-1 bg-gray-600 text-gray-200 rounded-lg"
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
              className="w-full p-1 bg-gray-600 text-gray-200 rounded-lg"
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
              className="w-full p-1 h-9 bg-gray-600 text-gray-200 rounded-lg"
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
              className="w-full p-1 bg-gray-600 text-gray-200 rounded-lg mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full bg-gray-600 text-gray-200 rounded-lg"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-gray-300 mb-1 border-none ">WhatsApp Number:</label>
            <div className="flex space-x-2">
              <select
                name="countryCode"
                value={petDetails.countryCode}
                onChange={handleInputChange}
                className="w-1/4 bg-gray-600 text-gray-200 p-1 rounded-lg"
              >
                {countryCodes.map((code) => (
                  <option key={code.code} value={code.code}>
                    {code.code} ({code.country})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="whatsappNumber"
                value={petDetails.whatsappNumber}
                onChange={handleInputChange}
                placeholder="Enter WhatsApp number"
                className="w-3/4 p-1 bg-gray-600 text-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white px-4 py-1 rounded-lg font-semibold transition-colors duration-300 hover:bg-indigo-600"
          >
            Add Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
