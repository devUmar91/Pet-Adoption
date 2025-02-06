import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([
 
  ]);

  useEffect(() => {
    const token = Cookies.get('token'); // Ensure 'token' matches the cookie name
    console.log(token);
    

    if (token) {

      // Function to decode a Base64Url encoded string
      const base64UrlDecode = (base64Url) => {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace characters
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      };

      // Split the token into its parts
      const parts = token.split('.');
      if (parts.length === 3) {
        const decodedPayload = base64UrlDecode(parts[1]); // Decode the payload
        setUser(decodedPayload); // Set the decoded payload to user state
        

        
      } else {
        console.error("Invalid JWT structure");
      }
    } else {
      console.log("No token found"); // Log if no token is found
    }
   }, []); // You can add `token` as a dependency if the token may change

  // Check if user state changes
  useEffect(() => {
  }, [user]);

  // Function to add a new pet
  const addPet = (newPet) => {
    setPets((prevPets) => [...prevPets, { ...newPet, id: prevPets.length + 1 }]);
  };

  // Function to get a pet by ID
  const getPetById = (id) => {
    return pets.find(pet => pet.id === parseInt(id));
  };
  console.log(user);
  

  return (
    <UserContext.Provider value={{user, setUser, pets, addPet, getPetById,  }}>
      {children}
    </UserContext.Provider>
  );
};

export const usePets = () => useContext(UserContext);