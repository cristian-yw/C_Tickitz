import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const errorRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formState, setFormState] = useState({ email: "", newPassword: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage("");
    const { email, newPassword } = formState;

    let errors = [];
    const emailptrn = /@.*\./;

    // Validasi email
    if (!email.match(emailptrn)) {
      errors.push("Email tidak valid");
    }

    // Validasi password baru
    if (newPassword.length < 8) errors.push("Password minimal 8 karakter");
    if (!/[a-z]/.test(newPassword))
      errors.push("Password harus mengandung huruf kecil");
    if (!/[!@#$%^&*/><]/.test(newPassword))
      errors.push("Password harus mengandung karakter spesial");

    if (errors.length > 0) {
      errorRef.current.innerHTML = errors.join("<br>");
      return;
    }

    // Cek user terdaftar
    const registered = JSON.parse(localStorage.getItem("registeredUser"));

    if (!registered || registered.email !== email) {
      errorRef.current.innerHTML = "Email tidak ditemukan di sistem";
      return;
    }

    // Update password di localStorage
    const updatedUser = { ...registered, password: newPassword };
    localStorage.setItem("registeredUser", JSON.stringify(updatedUser));

    errorRef.current.innerHTML = "";
    setSuccessMessage("Password berhasil direset! Silakan login kembali.");
    setTimeout(() => navigate("/signin"), 1500);
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
        <h3 className="mb-2 text-2xl text-left">Reset Password 🔑</h3>
        <p className="text-gray-500 mb-6">
          Masukkan email akun Anda dan password baru.
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

          {/* Password Baru */}
          <label htmlFor="newPassword" className="block text-left">
            New Password
          </label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formState.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
