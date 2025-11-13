import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../helpers/frontAuth";
import '../styles/RegisterLogin.css';

function Register () {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");   
const navigate = useNavigate(); 

  async function handleRegister() {
    setError("");

    if (username.length < 3) {
      setError("Användarnamnet måste vara minst 3 tecken.");
      return;
    }
    if (password.length < 3) {
      setError("Lösenordet måste vara minst 3 tecken.");
      return;
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        setError(data?.error || "Något gick fel vid registrering.");
        return;
      }

      if (data?.success && data.token && data.userId) {
        saveUser(data.token, data.userId, data.username ?? username);
        navigate("/loggedin");
      } else {
        setError("Kunde inte skapa användare (ogiltigt svar från servern).");
      }
    } catch (e) {
      console.error("Fel vid registrering:", e);
      setError("Kunde inte kontakta servern.");
    }
  }

return (
<div className="register-container">
      <h1>Registrera</h1>
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
        <button className="register" onClick={handleRegister} disabled={!username || !password}>Register</button>
    </div>
</div>

    );
}

export default Register;