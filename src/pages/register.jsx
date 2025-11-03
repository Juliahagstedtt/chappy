import { useState } from "react";
import '../styles/Register.css';


function Register () {
const [username, SetUsername] = useState("");
const [password, SetPassword] = useState("");
const [message, setMessage] = useState("");

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
            } else {
                setMessage(data.message || "Något gick fel vid registrering.");
            }
            console.log("Användare skapad");
    } catch (err) {
        console.error("Fel vid registrering", err);
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

        <button className="login">Login</button>
    </div>
</div>

    );
}

export default Register;