// import { useState } from 'react'
import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom';
import Headers from "./pages/Headers";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import LoggedIn from "./pages/LoggedIn";
import Channels from "./pages/Channels";
import Dm from "./pages/dm";


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
        <Route path="/dm" element={<Dm />} />

      </Routes>
    </>
  );
}

export default App
