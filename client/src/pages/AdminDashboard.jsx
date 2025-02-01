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
  const [selectedRequest, setSelectedRequest] = useState({});
  const [actionType, setActionType] = useState('');

  // Fetch token from cookies
  useEffect(() => {
    const fetchedToken = Cookies.get('token');
    if (fetchedToken) {
      setToken(fetchedToken);
      console.log("Token set:", fetchedToken);
    } else {
      console.log("No token found in cookies.");
    }
  }, []);

  // Fetch pending posts
  useEffect(() => {
    const fetchPendingPosts = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get('http://localhost:3000/admin/pending-posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pendingRequests = response.data.filter(request => request.adoptionStatus === 'pending');
        console.log(pendingRequests);
        
        setRequests(pendingRequests);
        // console.log(requests);
        
      } catch (error) {
        console.error('Error fetching pending posts:', error);
      }
    };

    fetchPendingPosts();
  }, [token]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!user || !token) return;

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

    fetchAllUsers();
  }, [user, token]);

  // Handle approve/reject requests
  const handleRequest = async (requestId) => {
    try {
      const endpoint = actionType === 'approve'
        ? `http://localhost:3000/admin/approve/${requestId}`
        : `http://localhost:3000/admin/reject/${requestId}`;
      const method = actionType === 'approve' ? 'put' : 'delete';

      const res = await axios({
        method,
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.filter(request => request._id !== requestId)
        );
      }
    } catch (error) {
      console.error(`Error ${actionType} request:`, error);
    }
  };

  // Open confirmation modal
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
              <div className="flex space-x-4">
                <Tooltip content="Approve Request">
                  <button
                    onClick={() => openModal(request, 'approve')}
                    className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                  >
                    Approve
                  </button>
                </Tooltip>
                <Tooltip content="Reject Request">
                  <button
                    onClick={() => openModal(request, 'reject')}
                    className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                  >
                    Reject
                  </button>
                </Tooltip>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Users Section */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">All Users</h3>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user._id} className="p-4 bg-gray-50 rounded-md shadow-sm text-gray-700">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Confirm {actionType} Action</h3>
            <p>Are you sure you want to {actionType} the request for <strong>{selectedRequest?.name}</strong>?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRequest(selectedRequest._id);
                  setShowModal(false);
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded ${actionType === 'approve' ? 'bg-green-500' : 'bg-red-500'} hover:bg-opacity-80`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
