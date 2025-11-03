import { useState } from "react";
import '../styles/Register.css';


function Register () {
const [username, SetUsername] = useState("");
const [password, SetPassword] = useState("");

// async function handleRegister() {
//     try {

//     }
// }

return (
<div className="register-container">
      <h1>Registrera</h1>
      <p>username:</p>
      <input className="register-input"
      type="text"
      placeholder="username"
      />

    <p>password:</p>
      <input className="register-input"
      type="password"
      placeholder="password"
      />
    <div className="Reg-buttons">
      <button className="register">Register</button>

      <button className="login">Login</button>
    </div>
</div>

    );
}

export default Register;