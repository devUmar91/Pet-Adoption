import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '@material-tailwind/react'; // Tooltip from Material Tailwind
import { UserContext } from '../Context/context';
import Cookies from 'js-cookie'; // Ensure this is installed
import axios from 'axios'; // Ensure axios is imported

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [actionType, setActionType] = useState('');


  useEffect(() => {
    const fetchedToken = Cookies.get('token');
    if (fetchedToken) {
      setToken(fetchedToken);
    }
  }, []);

  console.log(user);
  

  useEffect(() => {
    // if (!user) {
    //   console.error('User is not authenticated.');
    //   return;
    // }

    // console.log(user);
    

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
  }, [token, user]);

   
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
      fetchAllUsers();
    }
  }, [user,token]);

  const handleRequest = async (requestId) => {
    try {
      if (actionType === 'approve') {
        await axios.put(`http://localhost:3000/admin/approve/${requestId}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, adoptionStatus: 'Approved' } : request
          )
        );
        window.location.reload()
      } else if (actionType === 'reject') {
        const res = await axios.delete(`http://localhost:3000/admin/reject/${requestId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res); // Check the response
  
        if (res.status === 200) {
          const updatedRequests = await axios.get('http://localhost:3000/admin/pending-posts', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRequests(updatedRequests.data);
        } else {
          console.error("Failed to reject the request.");
        }
      }
    } catch (error) {
      console.error(`Error ${actionType === 'approve' ? 'approving' : 'rejecting'} request:`, error);
      // Consider displaying an error message to the user
    }
  };
  

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Admin Dashboard</h2>

      {/* Adoption Requests Section */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Manage Adoption Requests</h3>
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm">
              <div>
                <p className="font-medium text-gray-800">{request.user} - {request.name}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  request.adoptionStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                  request.adoptionStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {request.adoptionStatus}
                </span>
              </div>
              {request.adoptionStatus === 'pending' && (
                <div className="flex space-x-4">
                  <Tooltip content="Approve Request" placement="top">
                    <button
                      onClick={() => openModal(request, 'approve')}
                      className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                    >
                      Approve
                    </button>
                  </Tooltip>
                  <Tooltip content="Reject Request" placement="top">
                    <button
                      onClick={() => openModal(request, 'reject')}
                      className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
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

      {/* Users Section */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">All Users</h3>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user._id} className="p-4 bg-gray-50 rounded-md shadow-sm flex flex-col text-gray-700">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Contact:</span> {user.contact}</p>
              <p><span className="font-medium">Pets:</span> {user.pets.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[70%] md:w-[60%] max-h-[80%] overflow-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Confirm Action</h3>
      <p>Are you sure you want to {actionType} the request for <strong>{selectedRequest?.name}</strong>?</p>
      <div className="mt-4">
        <h4 className="text-md font-semibold text-gray-700">Pet Details:</h4>

        {/* Display multiple images */}
        {selectedRequest?.images?.length > 0 ? (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> {/* Adjust the number of columns based on screen size */}
    {selectedRequest.images.map((image, index) => (
      <img 
        key={index}
        src={image} 
        alt={`${selectedRequest.name} image ${index + 1}`} 
        className="w-full h-34 object-cover rounded-md" // Make the width full within the grid cell
      />
    ))}
  </div>
) : (
  <p>No images available for this pet.</p>
)}


        <p><strong>Name:</strong> {selectedRequest?.name}</p>
        <p><strong>Age:</strong> {selectedRequest?.age}</p>
        <p><strong>Breed:</strong> {selectedRequest?.breed}</p>
        <p><strong>Description:</strong> {selectedRequest?.description}</p>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 text-sm font-medium bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleRequest(selectedRequest._id);
            setShowModal(false);
          }}
          className={`px-4 py-2 text-sm font-medium text-white rounded ${
            actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          } transition duration-200`}
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
