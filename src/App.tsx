// import { useState } from 'react'
import './App.css'
import {  Routes, Route, NavLink } from 'react-router-dom';
import Headers from "./pages/Headers";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Menu from "./pages/Menu";

function App() {
  return (
    <>
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Menu" element={<Menu />} />

      </Routes>

      <nav>
        <NavLink to="/"></NavLink>
        <NavLink to="/Menu"></NavLink>

        {/* <NavLink to="/register">Register</NavLink> */}
      </nav>


    </>
  );
}

export default App
