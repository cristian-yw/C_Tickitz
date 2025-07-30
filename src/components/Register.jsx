import React, { useEffect, useRef } from 'react';

function Register() {
  const formRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    const errormsg = errorRef.current;

    const handleSubmit = (event) => {
      event.preventDefault();

      const email = form.email.value.trim();
      const password = form.password.value.trim();
      const agree = form.term.checked;
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
      if (email === "" || password === "") {
        errors.push("Email dan Password tidak boleh kosong");
      }
      if (!agree) {
        errors.push("Anda harus menyetujui syarat & ketentuan");
      }

      if (errors.length > 0) {
        errormsg.innerHTML = errors.join("<br>");
      } else {
        errormsg.innerHTML = "<span style='color:green'>Pendaftaran berhasil!</span>";
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem(
          "userlg",
          JSON.stringify({
            email: email,
            password: password,
            avatar: "/img/Ellipse 11.png",
          })
        );
        console.log(localStorage("email: ", email))
        form.reset(); 
      }
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, []);

  return (
    <>
      <div className="overlay">
        <img
          src="/icon.png"
          alt="Logo"
          className="Logo"
          width="276"
          height="104"
        />

        <div className="login-container">
          <div className="step-container">
            <div className="step active">
              <div className="circle">1</div>
              <p>Fill Form</p>
            </div>

            <div className="line"></div>

            <div className="step">
              <div className="circle">2</div>
              <p>Activate</p>
            </div>

            <div className="line"></div>

            <div className="step">
              <div className="circle">3</div>
              <p>Done</p>
            </div>
          </div>

          <form id="formlogin" ref={formRef}>
            <br />
            <label htmlFor="email">Email</label><br />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            /><br /><br />

            <label htmlFor="password">Password</label><br />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            /><br />

            <div className="error" id="errormsg" ref={errorRef}></div>

            <div className="terms-container">
              <input type="checkbox" name="term" id="term" />
              <label htmlFor="term"> I agree to terms & conditions</label><br /><br />
              <button type="submit">Join For Free Now</button>
            </div>
          </form>

          <br />
          <p className="center">
            Already have an account? <a href="#">Log in</a>
          </p>
          <br />
          <p className="text-center">Or</p>

          <div className="social">
            <button className="social-button">
              <img
                src="/icons_google.png"
                alt="Google"
                className="social-img"
              />
              Google
            </button>

            <button className="social-button">
              <img
                src="/logo_facebook.png"
                alt="Facebook"
                className="social-img"
              />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
