

import React from 'react'
import { Link } from 'react-router-dom'

function footer() {
  return (
    <div><footer class="bg-gray-900 py-10 text-gray-300 relative mt-10">
    {/* <!-- Curved Divider --> */}
    {/* <div class="absolute inset-x-0 top-0 overflow-hidden transform -translate-y-1/2">
      <svg class="w-full h-16" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <path fill="#115e59" fill-opacity="1" d="M0,160L60,170.7C120,181,240,203,360,224C480,245,600,267,720,256C840,245,960,203,1080,170.7C1200,139,1320,117,1380,106.7L1440,96V320H0Z"></path>
      </svg>
    </div> */}
  
    {/* <!-- Footer Content --> */}
    <div class="container mx-auto px-6 lg:px-20 z-10 relative">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* <!-- Logo & Mission --> */}
        <div>
          <h3 class="text-3xl font-bold text-white mb-4">PetPal</h3>
          <p class="text-sm w-[150px] text-gray-300">Find your new best friend. Helping pets find their forever homes with love.</p>
          <div class="mt-6">
            <Link to='#' class="inline-block text-yellow-400 hover:text-yellow-300 transition duration-300">Get Started →</Link>
          </div>
        </div>
        
        {/* <!-- Navigation Links --> */}
        <div>
          <h4 class="text-xl font-semibold text-white mb-4">Quick Links</h4>
          <div className='flex flex-col'>
          <Link to='/pets' className="text-gray-300 hover:text-yellow-400 transition">Adopt a pet</Link>
            <Link to='/login' className="text-gray-300 hover:text-yellow-400 transition">Login</Link>
            <Link to='/register' className="text-gray-300 hover:text-yellow-400 transition">Register</Link>
          </div>
          
          
        </div>
  
        {/* <!-- Contact & Social Media --> */}
        <div>
          <h4 class="text-xl font-semibold text-white mb-4">Stay Connected</h4>
          <p class="text-gray-400">Reach out for inquiries or follow us for updates on our mission to help pets.</p>
          <div class="mt-4 space-y-2">
            <p>Email: <a href="mailto:contact@petpal.com" class="text-yellow-400 hover:underline">contact@petpal.com</a></p>
            <p>Phone: <a href="tel:+1234567890" class="text-yellow-400 hover:underline">+123 456 7890</a></p>
          </div>
          <div class="mt-6 space-x-4">
            <Link to='/pets' className="text-gray-300 hover:text-yellow-400 transition"><i class="fab fa-facebook-f"></i></Link>
            <Link to='' className="text-gray-300 hover:text-yellow-400 transition"><i class="fab fa-twitter"></i></Link>
            <Link to='' className="text-gray-300 hover:text-yellow-400 transition"><i class="fab fa-instagram"></i></Link>
          </div>
        </div>
      </div>
    </div>
  
    {/* <!-- Bottom Note --> */}
    <div class="mt-1 border-t border-gray-600 pt-4 mb-[-35px]">
      <p class="text-center text-gray-400 text-sm">&copy; 2024 PetPal. All Rights Reserved.</p>
    </div>
  </footer></div>
  )
}

export default footer


