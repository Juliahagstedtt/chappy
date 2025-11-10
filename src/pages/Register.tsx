import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';

const LS_KEY = "jwt";
const LS_USERID = "userId";

function Register () {
const [username, SetUsername] = useState("");
const [password, SetPassword] = useState("");
const [message, setMessage] = useState("");

const navigate = useNavigate(); 

async function handleRegister() {
    try {
        const res = await fetch("http://localhost:10000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.token && data.userId) {
        localStorage.setItem(LS_KEY, data.token);
        localStorage.setItem(LS_USERID, data.userId);

        setMessage(data.message || "Användare skapad!");
        navigate("/loggedin", { state: { username } });
        } else {
        setMessage(data.message || data.error || "Något gick fel vid registrering.");
        }
    } catch (err) {
        console.error("Fel vid registrering", err);
        setMessage("Tekniskt fel vid registrering.");
    }
    }


async function handleLogin() {
    try {
        const res = await fetch("http://localhost:10000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.token && data.userId) {

        localStorage.setItem(LS_KEY, data.token);
        localStorage.setItem(LS_USERID, data.userId);
        localStorage.setItem("username", data.username);

        setMessage(data.message || "Inloggning lyckades!");
        navigate("/loggedin", { state: { username } });
        } else {
        setMessage(data.message || data.error || "Något gick fel vid inloggningen.");
        }
    } catch (err) {
        console.error("Fel vid inloggning", err);
        setMessage("Tekniskt fel vid inloggning.");
    }
    }


return (
<div className="register-container">
      <h1>Registrera</h1>
      <p>username:</p>
      <input className="register-input"
      type="text"
      placeholder="username"
      value={username}
      onChange={(e) => SetUsername(e.target.value)}
      />

    <p>password:</p>
      <input className="register-input"
      type="password"
      placeholder="password"
      value={password}
      onChange={(e) => SetPassword(e.target.value)}
      />

    <div className="Reg-buttons">
        <button className="register" onClick={handleRegister}>Register</button>
        <p className="message">{message}</p>


        <button className="login" onClick={handleLogin}>Login</button>
    </div>
</div>

    );
}

export default Register;