// src/components/Navbar.jsx
import { Link } from "react-router";
import ListItem from "./List";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slice/authSlice";
import { useState, useEffect } from "react";

function Navbar() {
  const navBtn = [
    { text: "Dasboard", route: "/dashboard" },
    { text: "Movies", route: "/adminmovie" },
  ];

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeProfileDropdown();
    closeMobileMenu();
  };

  // tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileDropdownOpen &&
        !event.target.closest(".profile-dropdown-container")
      ) {
        closeProfileDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <>
      {/* Navbar desktop */}
      <header className="relative z-50 flex items-center px-8 py-4 md:px-16 shadow-sm">
        <img src="/Vector copy.png" alt="Logo" />

        <nav className="ml-auto">
          <ul className="hidden gap-16 text-sm md:flex">
            {navBtn.map((nav, idx) => (
              <ListItem key={idx} to={nav.route} listText={nav.text} />
            ))}
          </ul>
        </nav>

        {/* kalau sudah login */}
        {user ? (
          <div className="ml-auto hidden items-center gap-4 text-base md:flex">
            <div>Location</div>
            <img src="/arrow-down.png" alt="Arrow Down" />
            <img src="/Search.png" alt="Search" />

            {/* Profile dropdown */}
            <div className="profile-dropdown-container relative">
              <button onClick={toggleProfileDropdown}>
                <img
                  src="/profile-pic.png"
                  alt="Profile"
                  className="cursor-pointer hover:opacity-80"
                />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/profile"
                    className="block w-2/3 rounded-md border px-5 py-3 text-center text-[#1D4ED8] hover:bg-gray-50"
                    onClick={closeProfileDropdown}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-2/3 rounded-md border border-red-500 px-5 py-3 text-center text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // kalau belum login
          <div className="ml-auto flex gap-4">
            <Link
              to="/signin"
              className="hidden rounded-md border px-5 py-2 text-[#1D4ED8] md:flex"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="hidden rounded-md border bg-[#1D4ED8] px-5 py-2 text-white md:flex"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* tombol hamburger */}
        <button
          className="relative z-60 ml-4 md:hidden"
          onClick={toggleMobileMenu}
        >
          <img src="/gg_menu-right-alt.png" alt="Hamburger Menu" />
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="fixed top-0 right-0 z-40 h-full w-80 bg-white shadow-lg">
            <div className="p-6 pt-16">
              <ul className="mb-8 space-y-6">
                {navBtn.map((nav, idx) => (
                  <li key={idx}>
                    <Link
                      to={nav.route}
                      className="block text-lg text-gray-800 hover:text-[#1D4ED8]"
                      onClick={closeMobileMenu}
                    >
                      {nav.text}
                    </Link>
                  </li>
                ))}
              </ul>

              {user ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <img
                      src="/arrow-down.png"
                      alt="Arrow Down"
                      className="h-4 w-4"
                    />
                    <span>Location</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/Search.png" alt="Search" className="h-6 w-6" />
                    <Link to="/profile" onClick={closeMobileMenu}>
                      <img
                        src="/profile-pic.png"
                        alt="Profile"
                        className="h-8 w-8"
                      />
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-2/3 rounded-md border border-red-500 px-5 py-3 text-center text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/signin"
                    className="block w-2/3 rounded-md border px-5 py-3 text-center text-[#1D4ED8] hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-2/3 rounded-md border bg-[#1D4ED8] px-5 py-3 text-center text-white hover:bg-blue-700"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default Navbar;
