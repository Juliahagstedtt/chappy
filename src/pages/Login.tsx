import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../helpers/frontAuth";
import '../styles/Register.css';

function Login () {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate(); 

  async function handleLogin() {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token && data.userId) {
      saveUser(data.token, data.userId, data.username ?? username);
      navigate("/loggedin");
    }
  }

return (
<div className="register-container">
      <h1>Logga In</h1>
      <p>användarnamn:</p>
      <input className="register-input"
      type="text"
      placeholder="användarnamn"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />

    <p>password:</p>
      <input className="register-input"
      type="Lösenord:"
      placeholder="Lösenord"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />

    <div className="Reg-buttons">        
        <button className="login" onClick={handleLogin} disabled={!username || !password}>Login</button>
    </div>
</div>

    );
}

export default Login;