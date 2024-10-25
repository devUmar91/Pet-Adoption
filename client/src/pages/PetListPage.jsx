import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/context";
import axios from 'axios';
import "flyonui/flyonui"
import "flyonui/dist/js/accordion"


const PetListPage = () => {
  const { user } = useContext(UserContext); // Get user role
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control the confirmation modal
    const [selectedPet, setSelectedPet] = useState(null); // Store the pet selected for deletion

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pets");
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchPets();
  }, []);

  // Open modal and set selected pet
  const openDeleteModal = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  // Delete pet and notify user
  const handleDelete = async () => {
    try {
      // Send delete request
      await axios.delete(`http://localhost:3000/pets/${selectedPet._id}`, { withCredentials: true });
      
      // Notify the pet's owner
      // await axios.post(`http://localhost:3000/notifications`, {
      //   userId: selectedPet.ownerId, // Assuming each pet has an `ownerId`
      //   message: `Your pet ${selectedPet.name} has been deleted by an admin.`,
      // });

      // Remove pet from state
      setPets(pets.filter(pet => pet._id !== selectedPet._id));
      closeModal(); // Close modal after deletion

    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 px-6 pt-24">
      {/* <h2 className="text-4xl font-extrabold text-center mb-12 tracking-wide">
        Available Pets
      </h2> */}

      {pets?.length === 0 ? (
      <div className="flex  flex-col items-center mt-[150px] justify-center">   
        {/* <span class="loading loading-spinner loading-xs"></span>
        <span class="loading loading-spinner loading-sm"></span>
        <span class="loading loading-spinner"></span> */}
        <p className="text-2xl font-bold font-sans text-gray-600">Loading pets</p>
        <span class="loading loading-ring loading-lg"></span>
        </div> ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <img src={pet.image} alt={pet.name} className="w-full h-56 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="text-2xl font-bold text-gray-100 mb-2">{pet.name}</h3>
                <p className="text-gray-400 mb-4">{pet.breed}</p>
                <p className={`mb-4 ${pet.adoptionStatus === "Adopted" ? "text-red-500" : pet.adoptionStatus === "Available" ? "text-green-500" : pet.adoptionStatus === "Pending" ? "text-orange-500" : "text-gray-400"}`}>
                  {pet.adoptionStatus}
                </p>
                
                <Link
                  to={`/pets/${pet._id}`}
                  className="block text-center bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-lg transition-colors"
                >
                  View Details
                </Link>

                {/* Show delete option if user is admin */}
                {user && user.role === 'admin' && (
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
            <p>Are you sure you want to delete <strong>{selectedPet.name}</strong>?</p>
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
