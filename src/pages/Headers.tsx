import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Headers.css";
import { getUser, logoutUser } from "../helpers/frontAuth";


export default function Headers() {
  const navigate = useNavigate();
  const { token } = getUser();

  function handleLogout() {
     logoutUser(); 
     navigate("/register"); 
  }

  return (
    <header>
      <nav>
        <Link to="/" className="logo">
          <img src={logo} alt="logo" className="chappy" />
        </Link>
      </nav>

      <div>
      {token && (
        <button type="button" onClick={handleLogout}>
          Logga ut
        </button>
      )}
      </div>
    </header>
  );
}