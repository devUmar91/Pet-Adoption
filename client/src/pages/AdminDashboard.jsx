import React, { useState } from 'react';
import { Tooltip } from '@material-tailwind/react'; // Import Tooltip from Material Tailwind (for example)

const AdminDashboard = () => {
  const [pets, setPets] = useState([
    { id: 1, name: 'Bella', breed: 'Labrador', adoptionStatus: 'Available' },
    { id: 2, name: 'Max', breed: 'German Shepherd', adoptionStatus: 'Available' },
    // More pets
  ]);

  const [requests, setRequests] = useState([
    { id: 1, user: 'John Doe', petName: 'Bella', status: 'Pending' },
    { id: 2, user: 'Jane Smith', petName: 'Max', status: 'Approved' },
    // More requests
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Function to approve an adoption request
  const approveRequest = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: 'Approved' }
          : request
      )
    );

    const petToUpdate = requests.find((request) => request.id === requestId);
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.name === petToUpdate.petName
          ? { ...pet, adoptionStatus: 'Pending' }
          : pet
      )
    );
  };

  // Function to reject an adoption request
  const rejectRequest = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: 'Rejected' }
          : request
      )
    );
  };

  // Function to delete a pet
  const deletePet = (petId) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.petName !== pets.find((pet) => pet.id === petId).name)
    );
  };

  // Function to show the modal for confirming the action
  const openModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto py-8 bg-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-center text-indigo-600">Admin Dashboard</h2>

      {/* Manage Pets Section */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-10 text-gray-200">
        <h3 className="text-2xl font-semibold mb-6 text-indigo-400">Manage Pets</h3>
        <ul className="space-y-4">
          {pets.map((pet) => (
            <li key={pet.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition-all">
              <div>
                <span className="text-xl font-bold">{pet.name}</span> - <span>{pet.breed}</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${pet.adoptionStatus === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {pet.adoptionStatus}
                </span>
              </div>
              <Tooltip content="Delete Pet" placement="top">
                <button
                  onClick={() => deletePet(pet.id)}
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>

      {/* Manage Requests Section */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold mb-6 text-indigo-400">Manage Adoption Requests</h3>
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition-all">
              <div>
                <span className="font-bold">{request.user}</span> - <span>{request.petName}</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${request.status === 'Approved' ? 'bg-green-500' : request.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                  {request.status}
                </span>
              </div>
              {request.status === 'Pending' && (
                <div className="flex space-x-4">
                  <Tooltip content="Approve Request" placement="top">
                    <button
                      onClick={() => approveRequest(request.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Approve
                    </button>
                  </Tooltip>
                  <Tooltip content="Reject Request" placement="top">
                    <button
                      onClick={() => rejectRequest(request.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Reject
                    </button>
                  </Tooltip>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Confirm Action</h3>
            <p>Are you sure you want to approve/reject this request for <strong>{selectedRequest.petName}</strong>?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  approveRequest(selectedRequest.id);
                  setShowModal(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
