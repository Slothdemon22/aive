import './App.css';
import Hero from './Components/Hero.jsx';
import Navbar from './Components/Navbar.jsx';
import User from './Components/User.jsx';

import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Signin from './Components/Signin.jsx';
import Register from './Components/Register.jsx';
import Cart from './Components/Cart.jsx';
import LandingPage from './Components/LandingPage.jsx';
import Footer from './Components/Footer.jsx';
function App() {
 axios.defaults.withCredentials=true;
 
  const [admin, setAdmin] = useState(false);
  const url = "https://backend-test1-kappa.vercel.app";
  //const url = "http://localhost:3000";

  useEffect(() => {
    const checkAuthStatus = async () => {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      const auth = localStorage.getItem('auth'); // Check stored auth state
  
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Auth:', auth);
  
      if (email && password && auth) {
        try {
          const response = await axios.post(`${url}/api/v1/users/login`, {
            email,
            password
          }, { withCredentials: true });
  
          console.log('Backend Response:', response.data);
          if (auth === "admin") {
            setAdmin(true);
            toast.success("Admin logged in successfully!");
          }
          else if (auth === "user") {
            setAdmin(false);
            toast.success("User logged in successfully!");
          }
          else {
            setAdmin
            toast.error(response.data.message || "Invalid credentials");
          }
  
          
        } catch (error) {
          toast.error(error.response?.data?.message || "Error fetching data");
        }
      } else {
        setAdmin(false);
        
      }
    };
  
    checkAuthStatus();
   // console.log("Auth", admin, user);
  }, []);
  
  const auth = localStorage.getItem('auth');
  return (
<>
    <Router>
      <Navbar admin={admin} url={url} setAdmin={setAdmin} />
      
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/signin' element={<Signin admin={admin} url={url} setAdmin={setAdmin} />} />

        
        <Route path='/user' element={(auth=="user"||auth=="admin") ? <User url={url}/> : <Navigate to='/' />} />
        <Route path='/cart' element={<Cart url={url} />} />
        
        <Route path='/register' element={<Register url={url} />} />
        </Routes>
        
      <ToastContainer />
      <Footer />
    </Router>
      
      </>
  );
}

export default App;
