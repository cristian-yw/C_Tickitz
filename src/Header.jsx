import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const toggleMenu = () => {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('show');
  };

  const logout = () => {
    localStorage.removeItem("userlg");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    navigate('/movies');
    console.log("Logged out");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/Vector.png" alt="Logo" />
      </div>

      <button className="hamburger-btn" onClick={toggleMenu}>
        <img src="/gg_menu-right-alt.png" alt="menu" />
      </button>

      <div className="nav-menu" id="nav-menu">
        <ul className="nav-links" id="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movie</Link></li>
          <li><Link to="/order">Buy Ticket</Link></li>
        </ul>

        <div id="userHeader" style={{ display: 'none', position: 'relative' }}>
          <img
            src=""
            alt="User"
            id="profileimg"
            style={{ width: '40px', borderRadius: '50%', cursor: 'pointer' }}
          />
          <div
            id="dropdown"
            style={{
              display: 'none',
              position: 'absolute',
              top: '50px',
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              padding: '10px',
              zIndex: 99,
            }}
          >
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="nav-buttons" id="authButtons">
          <button className="signin-btn">
            <Link to="/login">Sign In</Link>
          </button>
          <button className="signup-btn">
            <Link to="/register">Sign Up</Link>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
