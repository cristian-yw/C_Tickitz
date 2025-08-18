import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Slice/authSlice";
import { Link } from "react-router";

function Login() {
  const errorRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage("");
    const { email, password } = formState;

    let errors = [];
    const emailptrn = /@.*\./;

    // Cek format email
    if (!email.match(emailptrn)) {
      errors.push("Email tidak valid");
    } else {
      const registered = JSON.parse(localStorage.getItem("registeredUser"));

      if (!registered || registered.email !== email) {
        errors.push("Email tidak terdaftar");
      } else if (registered.password !== password) {
        errors.push("Password anda salah");
      }
    }

    // Validasi password
    if (password.length < 8) errors.push("Password minimal 8 karakter");
    if (!/[a-z]/.test(password))
      errors.push("Password harus mengandung huruf kecil");
    if (!/[!@#$%^&*/><]/.test(password))
      errors.push("Password harus mengandung karakter spesial");

    if (errors.length > 0) {
      errorRef.current.innerHTML = errors.join("<br>");
    } else {
      errorRef.current.innerHTML = "";
      // === UPDATE: langsung dispatch ke Redux ===
      dispatch(login({ email }));
      setSuccessMessage("Login berhasil!");
      setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/login.png')] bg-no-repeat bg-center bg-fixed bg-cover flex flex-col justify-center items-center font-['Dancing_Script']">
      <div className="absolute inset-0 z-1 bg-black/40"></div>
      <img
        src="/icon.png"
        alt="Logo"
        className="mb-4 drop-shadow-md w-[150px] h-auto max-w-full z-2"
      />

      <div className="bg-white p-12 rounded-xl shadow-lg z-20">
        <h3 className="mb-2 text-2xl text-left">Welcome Back👋</h3>
        <p className="text-gray-500 mb-6">
          Sign in with your data that you entered during your registration
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label htmlFor="email" className="block text-left">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4"
          />

          {/* Password */}
          <label htmlFor="password" className="block text-left">
            Password
          </label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <img
                src={
                  showPassword
                    ? "/eye-solid-full.svg"
                    : "/eye-slash-regular-full.svg"
                }
                alt={showPassword ? "Hide password" : "Show password"}
                className="w-5 h-5"
              />
            </span>
          </div>

          <div ref={errorRef} className="text-red-500 text-sm mb-2"></div>
          {successMessage && (
            <p className="text-green-500 text-sm mb-2">{successMessage}</p>
          )}
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <br />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-2 text-gray-400 text-sm">Or</p>

        <div className="flex gap-4 mt-4">
          <button className="flex items-center gap-2 border rounded-lg px-4 py-2 flex-1">
            <img src="/icons_google.png" alt="Google" className="w-5 h-5" />
            Google
          </button>
          <button className="flex items-center gap-2 border rounded-lg px-4 py-2 flex-1">
            <img src="/logo_facebook.png" alt="Facebook" className="w-5 h-5" />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
