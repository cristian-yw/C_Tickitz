import React from 'react';
import "tailwindcss";


function Footer() {
  return (
    <footer className="borde p-6 text-sm text-gray-600 font-sans text-left">
      <div className="max-w-xs mx-auto flex flex-col gap-10 py-8">
        <div>
          <img src="/Vector.png" alt="Tickitz Logo" className="mb-3" />
          <p>Stop waiting in line. Buy tickets conveniently, watch movies quietly.</p>
        </div>

        <div>
          <h3 className="text-gray-900 font-semibold mb-3">Explore</h3>
          <div>
            <ol className="grid grid-cols-3 gap-3">
            <a href="#" className="hover:text-indigo-600">Cinemas</a>
            <a href="#" className="hover:text-indigo-600">Movies List</a>
            <a href="#" className="hover:text-indigo-600">Notification</a>
            <a href="#" className="hover:text-indigo-600">My Ticket</a>
            </ol>
          </div>
        </div>

        {/* Sponsor */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-3">Our Sponsor</h3>
          <div className="flex gap-6 items-center">
            <img src="/image.png" alt="EBV.id" className="h-5" />
            <img src="/CineOne21 2.png" alt="CineOne21" className="h-5" />
            <img src="/hiflix 2.png" alt="Hiflix" className="h-5" />
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-3">Follow us</h3>
          <div className="flex gap-6 text-xl">
            <a href="#" className="hover:text-indigo-600"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-indigo-600"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-indigo-600"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-indigo-600"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      <div className="text-center border-t pt-5 text-gray-500 text-xs">
        © 2020 Tickitz. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
