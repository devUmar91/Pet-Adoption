import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/context";
import { Carousel, IconButton } from "@material-tailwind/react";
// import { CarouselDemo } from "@/components/demo/CarouselDemo";

const PetDetailsPage = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pets/${id}`);
        setPet(response.data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };
    fetchPetDetails();
  }, [id]);

  // <CarouselDemo></CarouselDemo>

  const handleAdoptionRequest = () => {
    if (pet.contact) {
      const encodedMessage = encodeURIComponent(
        `I am interested in Adopting ${pet.name}: ${message}`
      );
      const whatsappUrl = `https://wa.me/+92${pet.contact}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
    } else {
      alert("No contact number available for this pet.");
    }
  };

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-6">
        <h2 className="text-3xl mt-20 font-bold text-center text-gray-200 mt-10">
          Loading..
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-6">
      <div className="flex flex-col md:flex-row items-start bg-gray-800 mt-10 p-6 rounded-lg shadow-lg">
        
        {/* Pet Details Section */}
        <div className="flex-1 md:mr-8 mb-6 md:mb-0">
          <h2 className="text-4xl font-bold mb-4 text-indigo-400">{pet.name}</h2>
          <p className="text-md font-semibold mb-1">Breed: {pet.breed}</p>
          <p className="text-md font-semibold mb-1">Age: {pet.age}</p>
          <p className="text-md font-semibold mb-1">Category: {pet.category}</p>
          <p className="text-md font-semibold mb-1">
            Status:
            <span
              className={
                pet.adoptionStatus === "adopted"
                  ? "text-red-500"
                  : pet.adoptionStatus === "pending"
                  ? "text-orange-500"
                  : "text-green-500"
              }
            >
              {` ${pet.adoptionStatus}`}
            </span>
          </p>
          <p className="text-sm font-light mt-4 md:mt-6">{pet.description}</p>
          {!user && (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className={`w-full p-3 mt-4 bg-gray-700 rounded-lg text-gray-200 resize-none h-28 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                pet.adoptionStatus === "adopted"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={pet.adoptionStatus === "adopted"}
            />
          )}
          <div className="flex mt-6 space-x-4">
            {!user && (
              <button
                onClick={handleAdoptionRequest}
                className={`bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-300 hover:bg-indigo-600 shadow-lg transform hover:scale-105 ${
                  pet.adoptionStatus === "adopted"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={pet.adoptionStatus === "adopted"}
              >
                Contact on WhatsApp
              </button>
            )}
            <Link
              to="/pets"
              className="bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-300 hover:bg-indigo-600 shadow-lg transform hover:scale-105"
            >
              Back to Pets Page
            </Link>
          </div>
        </div>
        
        {/* Carousel Section */}
        <div className="w-full md:w-1/2 md:pl-8">
          <Carousel
            className="rounded-xl shadow-lg overflow-hidden"
            prevArrow={({ handlePrev }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute top-2/4 left-4 -translate-y-2/4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </IconButton>
            )}
            nextArrow={({ handleNext }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute top-2/4 right-4 -translate-y-2/4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </IconButton>
            )}
          >
            {pet.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${pet.name} image ${index + 1}`}
                className="w-full object-contain max-h-96"
              />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;
