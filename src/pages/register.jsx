import { useState } from "react";
import '../styles/Register.css';


function Register () {
const [username, SetUsername] = useState("");
const [password, SetPassword] = useState("");
const [message, setMessage] = useState("");
const [token, setToken] = useState(null);

async function handleRegister() {
    try {
        const res = await fetch("http://localhost:10000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Användare skapad!");
                setToken(data.token);
            } else {
                setMessage(data.message || data.error || "Något gick fel vid registrering.");
            }
            console.log("Användare skapad");
    } catch (err) {
        console.error("Fel vid registrering", err);
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
            if (res.ok) {
                setMessage(data.message || "Inloggning lyckades!");
                navigate("/loggedin", { state: { username } });
            } else {
                setMessage(data.message || data.error || "Något gick fel vid inloggningen.");
            }
            console.log("Användare inloggad");
    } catch (err) {
        console.error("Fel vid inloggning", err);
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