import React, { useEffect, useRef, useState } from 'react';

function Login() {
  const formRef = useRef(null);
  const errorRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const form = formRef.current;
    const errormsg = errorRef.current;

    const emaills = localStorage.getItem("email");
    const passls = localStorage.getItem("password");

    const handleSubmit = (event) => {
      event.preventDefault();
      setSuccessMessage(""); 
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      let errors = [];

      const emailptrn = /@.*\./;
      if (!email.match(emailptrn)) {
        errors.push("Email tidak valid");
      }
      if (password.length < 8) {
        errors.push("Password minimal 8 karakter");
      }
      if (!/[a-z]/.test(password)) {
        errors.push("Password harus mengandung huruf kecil");
      }
      if (!/[!@#$%^&*/><]/.test(password)) {
        errors.push("Password harus mengandung karakter spesial");
      }
      if (email !== emaills || password !== passls) {
        errors.push("Email atau Password anda salah");
      }

      if (errors.length > 0) {
        errormsg.innerHTML = errors.join("<br>");
      } else {
        errormsg.innerHTML = "";
        const userdata = {
          email,
          password,
          avatar: "/img/Ellipse 11.png",
        };
        localStorage.setItem("userlg", JSON.stringify(userdata));
        setSuccessMessage(" Login berhasil!");
      }
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, []);

  return (
    <div className="overlay">
      <img src="/icon.png" alt="Logo" className="Logo" width="276" height="104" />
      <div className="login-container">
        <h3>Welcome Back👋</h3>
        <p>Sign in with your data that you entered during your registration</p>

        <form id="formlogin" ref={formRef}>
          <label htmlFor="email">Email</label><br />
          <input type="email" id="email" name="email" placeholder="Enter your email" /><br /><br />

          <label htmlFor="password">Password</label><br />
          <input type="password" id="password" name="password" placeholder="Enter your password" />

          <div className="error" id="errormsg" ref={errorRef}></div>
          {successMessage && <p className="success">{successMessage}</p>}

          <a href="#" className="forgot">Forgot your password?</a><br />
          <button type="submit">Login</button><br />
        </form>

        <br />
        <p className="center">Or</p>
        <div className="social">
          <button className="social-button">
            <img src="/icons_google.png" alt="Google" className="social-img" />Google
          </button>
          <button className="social-button">
            <img src="/logo_facebook.png" alt="Facebook" className="social-img" />Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
