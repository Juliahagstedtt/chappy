import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Headers.css";

const LS_KEY = "jwt";

export default function Headers() {
  const jwt = localStorage.getItem(LS_KEY);

  function logout() {
    localStorage.removeItem(LS_KEY);
    location.reload();
  }

  return (
    <header>
      <nav>
        <Link to="/" className="logo">
          <img src={logo} alt="logo" className="chappy" />
        </Link>

        {" "}
        <Link to="/channel">Kanaler</Link> |{" "}
        <Link to="/dm">DM</Link> | <Link to="/register">Register</Link>
      </nav>

      <div>
        {jwt ? (
          <>
            Inloggad{" "}
            <button type="button" onClick={logout}>
              Logga ut
            </button>
          </>
        ) : (
          <>Gäst</>
        )}
      </div>
    </header>
  );
}