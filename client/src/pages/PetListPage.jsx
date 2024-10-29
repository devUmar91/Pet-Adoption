import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/context";
import axios from "axios";

const PetListPage = () => {
  const { user } = useContext(UserContext); 
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pets");
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const fetchFilteredPets = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/pets/city?city=${searchCity}`);
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching filtered pets:", error);
    }
  };

  const handleSearch = () => {
    fetchFilteredPets();
  };

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
    <div className="min-h-screen bg-gray-200 text-gray-800 px-6 pt-24">
      {/* Search Section */}
      <div className="mb-6 flex justify-center min-w-1 gap-4">
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Search by city"
          className="p-2 border capitalize border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 min-w-[5px] text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Pet List */}
      {pets.length === 0 ? (
        <div className="flex flex-col items-center mt-16">
          <p className="text-2xl font-bold text-gray-600">Loading pets...</p>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <img src={pet.images[0]} alt={pet.name} className="w-full h-56 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="text-2xl font-bold text-gray-100 mb-2">{pet.name}</h3>
                <p className="text-gray-400 mb-4">{pet.city}</p>
                <p className={`mb-4 ${pet.adoptionStatus === "adopted" ? "text-red-500" : pet.adoptionStatus === "available" ? "text-green-500" : pet.adoptionStatus === "pending" ? "text-orange-500" : "text-gray-400"}`}>
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
