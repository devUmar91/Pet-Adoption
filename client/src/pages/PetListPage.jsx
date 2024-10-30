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

  // Extract unique cities and categories for filtering
  const extractCitiesAndCategories = (data) => {
    const uniqueCities = [...new Set(data.map((pet) => pet.city))];
    const uniqueCategories = [...new Set(data.map((pet) => pet.category))];
    setCities(uniqueCities);
    setCategories(uniqueCategories);
  };

  // Handle filter change
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
    <div className="min-h-screen bg-gray-200 text-gray-800 px-6 pt-24 flex">
      {/* Filter Sidebar */}
      <aside className="w-1/4 p-4 bg-white mt-8 rounded-lg shadow-lg h-full sticky top-24">
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
      <div className="w-3/4 pl-6">
        {filteredPets.length === 0 ? (
          <div className="flex flex-col items-center mt-16">
            <p className="text-2xl font-bold text-gray-600">No pets available...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <img src={pet.images[0]} alt={pet.name} className="w-full h-56 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">{pet.name}</h3>
                  <p className="text-gray-400 mb-4">{pet.city}</p>
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
                    className="block text-center bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  {user && user.role === "admin" && (
                    <button
                      onClick={() => openDeleteModal(pet)}
                      className="mt-3 w-full text-center bg-red-500 hover:bg-red-400 text-white py-2 rounded-lg transition-colors"
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
