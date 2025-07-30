import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/style/index.css'
// import './style/Login.css'
import './style/home2.css'
import Footer from './components/Footer.jsx'
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Movies from './components/Movies.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <MyCounter /> */}
    {/* <Tabel /> */}
    {/* <Register /> */}
    <Movies />
    {/* <Login /> */}
    {/* <DomMinitask /> */}
  </StrictMode>,
)
