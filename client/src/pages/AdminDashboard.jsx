import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from '@material-tailwind/react';
import { UserContext } from '../Context/context';
import Cookies from 'js-cookie';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    const fetchedToken = Cookies.get('token');
    if (fetchedToken) {
      setToken(fetchedToken);
    }
  }, []);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:3000/admin/pending-posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.filter(request => request.adoptionStatus === 'pending'));
      } catch (error) {
        console.error('Error fetching pending posts:', error);
      }
    };
    fetchPendingPosts();
  }, [token]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!user || !token) return;
      try {
        const response = await axios.get('http://localhost:3000/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAllUsers();
  }, [user, token]);

  const handleRequest = async (requestId) => {
    try {
      const endpoint = actionType === 'approve'
        ? `http://localhost:3000/admin/approve/${requestId}`
        : `http://localhost:3000/admin/reject/${requestId}`;
      const method = actionType === 'approve' ? 'put' : 'delete';

      const res = await axios({
        method,
        url: endpoint,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setRequests((prevRequests) => prevRequests.filter(request => request._id !== requestId));
        setShowModal(false);
      }
    } catch (error) {
      console.error(`Error ${actionType} request:`, error);
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
      
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Manage Adoption Requests</h3>
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm">
              <div>
                <p className="font-medium text-gray-800">{request.name}</p>
              </div>
              <div className="flex space-x-4">
                <Tooltip content="View Details">
                  <button
                    onClick={() => openModal(request, 'view')}
                    className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                  >
                    View
                  </button>
                </Tooltip>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-700">
            <h3 className="text-lg font-semibold mb-4">Pet Details</h3>
            <img src={selectedRequest.image} alt={selectedRequest.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <p><strong>Name:</strong> {selectedRequest.name}</p>
            <p><strong>Breed:</strong> {selectedRequest.breed}</p>
            <p><strong>Age:</strong> {selectedRequest.age} years</p>
            <p><strong>City:</strong> {selectedRequest.city}</p>
            <p><strong>Description:</strong> {selectedRequest.description}</p>
            <p><strong>Contact:</strong> {selectedRequest.contactNumber}</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium bg-gray-400 text-white rounded hover:bg-gray-500">
                Close
              </button>
              <button onClick={() => handleRequest(selectedRequest._id)} className={`px-4 py-2 text-sm font-medium text-white rounded ${actionType === 'approve' ? 'bg-green-500' : 'bg-red-500'} hover:bg-opacity-80`}>
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
