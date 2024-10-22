import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Import FontAwesome icons

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState(""); // New state for WhatsApp number
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/auth/register",
        {
          name,
          email,
          password,
          whatsappNumber, // Include WhatsApp number in request
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className=" mx-auto bg-gray-200 py-[130px]">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute  right-0 flex items-center pr-3 text-gray-500 mb-5 top-11"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">WhatsApp Number</label>
            <div className="flex">
              {/* Country code dropdown */}
              <div className="relative">
                <select
                  className="block appearance-none w-[120px] bg-gray-200 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-l-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+92">+92 (Pak)</option>
                </select>
              </div>

              {/* WhatsApp number input */}
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter your WhatsApp number"
                className="w-full px-4 py-2 border border-l-0 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Register
          </button>
        </form>

        {/* Already have an account? */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
