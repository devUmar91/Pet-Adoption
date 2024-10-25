import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '@material-tailwind/react'; // Import Tooltip from Material Tailwind (for example)
import { UserContext } from '../Context/context'; // Adjust import path as needed
import Cookies from 'js-cookie'; // Ensure this is installed
import axios from 'axios'; // Ensure axios is imported

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]); // State for adoption requests
  const [users, setUsers] = useState([]); // State for all users
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedRequest, setSelectedRequest] = useState([]); // State for selected request
  const [actionType, setActionType] = useState(''); // State for action type (approve/reject)

  useEffect(() => {
    const fetchedToken = Cookies.get('token');
    if (fetchedToken) {
      setToken(fetchedToken);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      console.error('User is not authenticated.');
      return; // Prevent further execution if user is not logged in
    }

    // if (user.role === 'user') {
    //   navigate('/home'); // Adjust the route based on your app's routing
    //   return; // Prevent further execution
    // }

    const fetchPendingPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/pending-posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pendingRequests = response.data.filter(request => request.adoptionStatus === 'pending');
        setRequests(pendingRequests);
      } catch (error) {
        console.error('Error fetching pending posts:', error);
      }
    };
    

    fetchPendingPosts();
  }, [token, user]); // Add token and user to dependencies

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllUsers(); // Fetch all users when the user is authenticated
    }
  }, [user]);

  console.log(user);
  

  // Approve or Reject an adoption request
  // Approve or Reject an adoption request
const handleRequest = async (requestId) => {
  try {
    if (actionType === 'approve') {
      await axios.put(`http://localhost:3000/admin/approve/${requestId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update local state
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, adoptionStatus: 'Approved' }
            : request
        )
      );
      console.log("approved");
    } else if (actionType === 'reject') {
      await axios.delete(`http://localhost:3000/admin/reject/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refetch pending requests after rejection to ensure state consistency
      const updatedRequests = await axios.get('http://localhost:3000/admin/pending-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(updatedRequests.data);
      setRequests(updatedRequests.data);
      console.log("rejected and updated");
    }
  } catch (error) {
    console.error(`Error ${actionType === 'approve' ? 'approving' : 'rejecting'} request:`, error);
  }
};


  // Show confirmation modal
  const openModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto py-8 bg-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-center text-indigo-600">Admin Dashboard</h2>

      {/* Render Adoption Requests */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-400">Manage Adoption Requests</h3>
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition-all">
              <div>
                <span className="font-bold">{request.user}</span> - <span>{request.name}</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${request.adoptionStatus === 'Approved' ? 'bg-green-500' : request.adoptionStatus === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                  {request.adoptionStatus}
                </span>
              </div>
              {request.adoptionStatus === 'pending' && (
                <div className="flex space-x-4">
                  <Tooltip content="Approve Request" placement="top">
                    <button
                      onClick={() => openModal(request, 'approve')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Approve
                    </button>
                  </Tooltip>
                  <Tooltip content="Reject Request" placement="top">
                    <button
                      onClick={() => openModal(request, 'reject')}
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

      {/* Render All Users */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-400">All Users</h3>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition-all">
              <span className="font-bold">{user.name}</span> - <span>{user.email}</span> <span>{user.contact}</span> <span>{user.pets[0]}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8">
      <h3 className="text-2xl font-semibold mb-4">Confirm Action</h3>
      <p>Are you sure you want to {actionType} the request for <strong>{selectedRequest?.name}</strong>?</p>

      {/* Pet Information */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold">Pet Details:</h4>
        <p><strong>Name:</strong> {selectedRequest?.name}</p>
        <p><strong>Age:</strong> {selectedRequest?.age}</p>
        <p><strong>Breed:</strong> {selectedRequest?.breed}</p>
        <p><strong>Description:</strong> {selectedRequest?.description}</p>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleRequest(selectedRequest._id); // Call the function to handle the request
            setShowModal(false);
          }}
          className={`bg-${actionType === 'approve' ? 'blue' : 'red'}-500 text-white px-4 py-2 rounded-lg hover:bg-${actionType === 'approve' ? 'blue' : 'red'}-600 transition duration-200`}
        >
          {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
