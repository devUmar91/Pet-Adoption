// import React, { useState } from 'react';

// const PetForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     breed: '',
//     age: '',
//     contactNumber: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { name, breed, age, contactNumber } = formData;

//     // Check if contact number has a valid format (must include country code)
//     const phoneNumberPattern = /^\d{1,15}$/; // Ensures only digits are used
//     if (!phoneNumberPattern.test(contactNumber)) {
//       alert('Please enter a valid contact number including the country code (e.g., 1234567890)');
//       return;
//     }

//     // Construct the WhatsApp message URL
//     const whatsappUrl = `https://wa.me/${contactNumber}?text=Hello! I'm interested in adopting ${name} (${breed}, ${age} years old).`;

//     // Redirect to WhatsApp with prefilled message
//     window.open(whatsappUrl, '_blank');
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Adopt a Pet</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Pet Name:</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Breed:</label>
//           <input
//             type="text"
//             name="breed"
//             value={formData.breed}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Age:</label>
//           <input
//             type="number"
//             name="age"
//             value={formData.age}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Contact Number (with country code, e.g., 1234567890):</label>
//           <input
//             type="text"
//             name="contactNumber"
//             value={formData.contactNumber}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             placeholder="Country code + number"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           Send to WhatsApp
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PetForm;
