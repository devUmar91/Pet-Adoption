import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/context";
import axios from "axios";

const PetListPage = () => {
  const { user } = useContext(UserContext);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    fetchPets();
    // console.log(user);
  }, []);

  

  const fetchPets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pets");
      setPets(response.data);
      setFilteredPets(response.data); // Initially, show all pets
      extractCitiesAndCategories(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const extractCitiesAndCategories = (data) => {
    const uniqueCities = [...new Set(data.map((pet) => pet.city))];
    const uniqueCategories = [...new Set(data.map((pet) => pet.category))];
    setCities(uniqueCities);
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    const filterResults = () => {
      let results = pets;

      if (selectedCity) {
        results = results.filter((pet) => pet.city === selectedCity);
      }
      if (selectedCategory) {
        results = results.filter((pet) => pet.category === selectedCategory);
      }

      setFilteredPets(results);
    };

    filterResults();
  }, [selectedCity, selectedCategory, pets]);

  const openDeleteModal = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/pets/${selectedPet._id}`, {
        withCredentials: true,
      });
      setPets(pets.filter((pet) => pet._id !== selectedPet._id));
      closeModal();
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 px-4 pt-24 pb-10">
      {/* Filter on Top for Mobile Screens */}
      <aside className="mb-6 bg-white p-4 rounded-lg md:w-1/2 md:ml-[25%] lg:ml-0 shadow-lg lg:w-1/4 lg:sticky  mr-5 lg:top-24 lg:float-left">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Filter Pets</h2>
        <div className="mb-6">
          <label className="block text-gray-600 font-semibold mb-2">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Cities</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 font-semibold mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedCity("");
            setSelectedCategory("");
          }}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          Clear Filters
        </button>
      </aside>

      {/* Pet List */}
      <div className="lg:ml-6 lg:w-4/4">
        {filteredPets.length === 0 && (selectedCity || selectedCategory) ? (
          <div className="flex flex-col items-center mt-10">
            <p className="text-2xl font-bold text-gray-600">Pet not found.</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold mt-10 text-gray-600">Loading pets...</p>
            <span className="loading loading-ring loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-4 ml-4">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <img src={pet.images[0]} alt={pet.name} className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-100 mb-1">{pet.name}</h3>
                  <p className="text-gray-400 mb-2">{pet.city}</p>
                  <p className="text-gray-400 mb-2">{pet.category}</p>
                  <p
                    className={`mb-4 ${
                      pet.adoptionStatus === "adopted"
                        ? "text-red-500"
                        : pet.adoptionStatus === "available"
                        ? "text-green-500"
                        : pet.adoptionStatus === "pending"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  >
                    {pet.adoptionStatus}
                  </p>
                  <Link
                    to={`/pets/${pet._id}`}
                    className="block text-center bg-indigo-500 hover:bg-indigo-400 text-white py-1 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  {user && user.role === "admin" && (
                    <button
                      onClick={() => openDeleteModal(pet)}
                      className="mt-2 w-full text-center bg-red-500 hover:bg-red-400 text-white py-1 rounded-lg transition-colors"
                    >
                      Delete Pet
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete <strong>{selectedPet.name}</strong>?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetListPage;
