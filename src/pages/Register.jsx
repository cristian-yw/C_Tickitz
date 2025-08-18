import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function Register() {
  const formRef = useRef(null);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = formRef.current.email.value.trim();
    const password = formRef.current.password.value.trim();
    const agree = formRef.current.term.checked;
    let errors = [];

    const emailptrn = /@.*\./;
    if (!email.match(emailptrn)) errors.push("Email tidak valid");
    if (password.length < 8) errors.push("Password minimal 8 karakter");
    if (!/[a-z]/.test(password))
      errors.push("Password harus mengandung huruf kecil");
    if (!/[!@#$%^&*/><]/.test(password))
      errors.push("Password harus mengandung karakter spesial");
    if (!agree) errors.push("Anda harus menyetujui syarat & ketentuan");

    if (errors.length > 0) {
      errorRef.current.innerHTML = errors.join("<br>");
    } else {
      errorRef.current.innerHTML =
        "<span class='text-green-500'>Pendaftaran berhasil!</span>";
      registerUser(email, password);
      formRef.current.reset();
      setTimeout(() => navigate("/signin"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/login.png')] bg-no-repeat bg-center bg-fixed bg-cover flex flex-col justify-center items-center font-['Dancing_Script']">
      <div className="absolute inset-0 z-1 bg-black/40"></div>
      <img
        src="/icon.png"
        alt="Logo"
        className="w-[276px] h-[104px] mb-6 z-2"
      />

      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 z-2">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 z-3">
          {["Fill Form", "Activate", "Done"].map((step, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex flex-col items-center ${
                  index === 0 ? "text-blue-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                    index === 0 ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs mt-1">{step}</p>
              </div>
              {index < 2 && <div className="flex-1 h-px bg-gray-300"></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit}>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg p-2 mt-1 mb-4 focus:ring focus:ring-blue-200"
          />

          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg p-2 pr-10 mt-1 focus:ring focus:ring-blue-200"
            />
            <img
              src={
                showPassword
                  ? "/eye-solid-full.svg"
                  : "/eye-slash-regular-full.svg"
              }
              alt="Toggle Password"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>

          <div ref={errorRef} className="text-red-500 text-sm mt-2 mb-4"></div>

          <div className="flex items-center mt-2 mb-4">
            <input type="checkbox" name="term" id="term" className="mr-2" />
            <label htmlFor="term" className="text-sm">
              I agree to terms & conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Join For Free Now
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
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

export default Register;
