import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PetListPage from './pages/PetListPage';
import PetDetailsPage from './pages/PetDetailsPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';

  
  
  
// import { UserProvider } from './Context/context';
// import PetForm from './pages/petForm';
import axios from 'axios';
import { UserProvider } from './Context/context';

axios.default.withCredentails=true

function App() {
  return (
    <UserProvider>
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<PetListPage />} />
          <Route path="/pets/:id" element={<PetDetailsPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/petform" element={<PetForm />} /> */}
          
        </Routes>
      </div>
    </Router>
    </UserProvider>

  );
}

export default App;
