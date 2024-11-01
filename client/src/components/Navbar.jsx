import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlignJustify } from 'react-icons/fi';
import { UserContext } from '../Context/context';
import Cookies from 'js-cookie';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // State to control the modal type
  const navigate = useNavigate();

  const handleLogoutConfirmation = () => {
    setModalType('logout'); // Set modal type to "logout"
    setShowModal(true); // Show the confirmation modal
  };

  const confirmLogout = () => {
    Cookies.remove('token');
    setUser(null);
    setShowModal(false);
    setModalType(null);
    navigate('/login');
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    setShowModal(false);
    setModalType(null);
    navigate('/login');
  };

  // Show login modal if user is not logged in
  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent navigation
      setModalType('login'); // Set modal type to "login"
      setShowModal(true); // Show the login modal
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-gray-100 text-2xl font-extrabold tracking-wide hover:text-indigo-400 transition-colors duration-300"
        >
          PetPal
        </Link>
        <FiAlignJustify
          onClick={toggleMenu}
          className="text-gray-100 text-2xl md:hidden focus:outline-none"
        />
        <div className="hidden md:flex space-x-6">
          <Link
            to="/pets"
            className="text-gray-200 border-b-2 border-t-2 border-transparent hover:border-indigo-400 hover:text-indigo-400 px-3 py-2 rounded-lg transition-all duration-300"
          >
            Available Pets
          </Link>
          <Link
            to={user ? "/dashboard" : "#"}
            onClick={handleProtectedClick}
            className="text-gray-200 border-b-2 border-t-2 border-transparent hover:border-indigo-400 hover:text-indigo-400 px-3 py-2 rounded-lg transition-all duration-300"
          >
            Add a pet
          </Link>

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className="text-gray-200 border-b-2 border-t-2 border-transparent hover:border-indigo-400 hover:text-indigo-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Admin Dashboard
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className="text-gray-200 border-b-2 border-t-2 border-transparent hover:border-indigo-400 hover:text-indigo-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Login
            </Link>
          )}

          {!user && (
            <Link
              to="/register"
              className="text-gray-200 border-b-2 border-t-2 border-transparent hover:border-indigo-400 hover:text-indigo-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Register
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogoutConfirmation}
              className="text-gray-200 border-b-2 border-t-2 border-transparent hover:border-indigo-400 hover:text-indigo-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <Link
            to="/pets"
            className="block text-gray-200 py-2 px-4 border-b border-gray-700 hover:bg-gray-700 hover:text-indigo-400 transition duration-300"
            onClick={toggleMenu}
          >
            Available Pets
          </Link>
          <Link
            to={user ? "/dashboard" : "#"}
            onClick={handleProtectedClick}
            className="block text-gray-200 py-2 px-4 border-b border-gray-700 hover:bg-gray-700 hover:text-indigo-400 transition duration-300"
          >
            Add a pet
          </Link>

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className="block text-gray-200 py-2 px-4 border-b border-gray-700 hover:bg-gray-700 hover:text-indigo-400 transition duration-300"
              onClick={toggleMenu}
            >
              Admin Dashboard
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className="block text-gray-200 py-2 px-4 border-b border-gray-700 hover:bg-gray-700 hover:text-indigo-400 transition duration-300"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
          {!user && (
            <Link
              to="/register"
              className="block text-gray-200 py-2 px-4 hover:bg-gray-700 hover:text-indigo-400 transition duration-300"
              onClick={toggleMenu}
            >
              Register
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogoutConfirmation}
              className="block text-gray-200 py-2 px-4 hover:bg-gray-700 hover:text-indigo-400 transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {modalType === 'login' ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                <p className="mb-4">You need to log in to access this feature.</p>
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Close
                  </button>
                  <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Log In
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Confirm Logout</h2>
                <p className="mb-4">Are you sure you want to log out?</p>
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Cancel
                  </button>
                  <button onClick={confirmLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
