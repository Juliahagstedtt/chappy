import { useState } from "react";
import "../styles/Home.css";

const LS_KEY = "jwt";

function Home() {
  const jwt = localStorage.getItem(LS_KEY);

  return (
    <div className="home-container">
      <h1>Välkommen till Chappy!</h1>

      {jwt ? (
        <p>Du är inloggad</p>
      ) : (
        <p>Du är gäst</p>
      )}
    </div>
  );
}

export default Home;