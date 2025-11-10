// import { useState } from 'react'
import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom';
import Headers from "./pages/Headers";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import LoggedIn from "./pages/LoggedIn";
import Channels from "./pages/Channels";


function App() {
  return (
    <>
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/loggedin" element={<LoggedIn />} />
        <Route path="/channel" element={<Channels />} />


      </Routes>

      <nav>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/loggedin">Login</NavLink>
        <NavLink to="/channel">Channel</NavLink>
      </nav>


    </>
  );
}

export default App
