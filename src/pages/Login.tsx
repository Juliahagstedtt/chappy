import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../helpers/frontAuth";
import '../styles/RegisterLogin.css';

function Login () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");   
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });


      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        setError(data?.error || "Något gick fel vid inloggningen.");
        return;
      }

      if (data?.success && data.token && data.userId) {
        saveUser(data.token, data.userId, data.username ?? username);
        navigate("/loggedin");
      } else {
        setError("Kunde inte logga in.");
      }
    } catch (e) {
      console.error("Fel vid login:", e);
      setError("Kunde inte kontakta servern.");
    }
  }

return (
<div className="login-container">
      <h1>Logga In</h1>
      <p>Användarnamn:</p>
      <input className="register-input"
      type="text"
      placeholder="Användarnamn"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />

    <p>Lösenord:</p>
      <input className="register-input"
      type="password"
      placeholder="Lösenord"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="message">{error}</p>}

    <div className="Reg-buttons">        
        <button className="login" onClick={handleLogin} disabled={!username || !password}>Logga In</button>
    </div>
</div>

    );
}

export default Login;