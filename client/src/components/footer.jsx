import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  // Function to scroll to the top
  // it scrolls up to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <footer className="bg-gray-800 py-10 text-gray-300 relative mt-10">
        <div className="container mx-auto px-6 lg:px-20 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Logo & Mission */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">PetPal</h3>
              <p className="text-sm w-[150px] text-gray-300">Find your new best friend. Helping pets find their forever homes with love.</p>
              <div className="mt-6">
                <Link to='#' onClick={scrollToTop} className="inline-block text-yellow-400 hover:text-yellow-300 transition duration-300">Get Started →</Link>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
              <div className='flex flex-col space-y-2'>
                <Link to='/pets' onClick={scrollToTop} className="text-gray-300 w-full hover:text-yellow-400 transition">Adopt a pet</Link>
                <Link to='/login' onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition">Login</Link>
                <Link to='/register' onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition">Register</Link>
              </div>
            </div>

            {/* Contact & Social Media */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Stay Connected</h4>
              <p className="text-gray-400">Reach out for inquiries or follow us for updates on our mission to help pets.</p>
              <div className="mt-4 space-y-2">
                <p>Email: <a href="mailto:umree.dev@gmail.com" className="text-yellow-400 hover:underline">umree.dev@gmail.com</a></p>
                <p>Phone: <a href='https://wa.me/+923209369167?' target='_blank' className="text-yellow-400 hover:underline ">+92 320 9369167</a></p>
              </div>
              <div className="mt-6 space-x-4">
                <Link to='/pets' onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition"><i className="fab fa-facebook-f"></i></Link>
                <Link to='' onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition"><i className="fab fa-twitter"></i></Link>
                <Link to='' onClick={scrollToTop} className="text-gray-300 hover:text-yellow-400 transition"><i className="fab fa-instagram"></i></Link>
              </div>
            </div>
          </div>
        </div>
      
        {/* Bottom Note */}
        <div className="mt-1 border-t border-gray-600 pt-4 mb-[-35px]">
          <p className="text-center text-gray-400 text-sm">&copy; 2024 PetPal. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;