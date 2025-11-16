import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logoutIcon from "../assets/Logout.png";
import removeAccount from "../assets/removeAccount.png";
import "../styles/Headers.css";
import { useUserStore } from "../helpers/userStore.js";


export default function Headers() {
  const navigate = useNavigate();

  const token = useUserStore((s) => s.token);
  const userId = useUserStore((s) => s.userId);
  const logout = useUserStore((s) => s.logout);  

  function handleLogout() {
      logout();
      navigate("/login");
  }


async function handleDeleteAccount() {
  if (!token || !userId) {
    return;
  }

  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      logout();
      navigate("/register");
    } else {
      console.error("Fel vid borttagning:", await res.json());
    }
  } catch (err) {
    console.error("Nätverksfel:", err);
  }
}

  return (
    <header className="head-menu">
<nav>
  <Link to="/" className="logo">
    <img src={logo} alt="logo" className="chappy" />
  </Link>

  <div className="nav-buttons">
    <Link to="/channel">
      <button type="button">Kanaler</button>
    </Link>

    {!token && (
      <>
        <Link to="/login">
          <button type="button">Logga in</button>
        </Link>
      </>
    )}


    {token && (
      <>
      <div className="loggedIn-buttons">
        <Link to="/dm">
          <button type="button">Meddelanden</button>
        </Link>
        <button className="remove-button" type="button" onClick={handleDeleteAccount}>                
            <img src={removeAccount} alt="removeAccount-ikon" />
        </button>
              <button
                type="button"
                onClick={handleLogout}
                className="logout-button">
                <img src={logoutIcon} alt="logout-ikon" />
              </button>
     </div></>
    )}
  </div>
</nav>
    </header>
  );
}