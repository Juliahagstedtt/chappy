import {  } from "../helpers/frontAuth";


function LoggedIn() {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  return (
    <div>
      <h1>Inloggad!</h1>
      <p>Välkommen {username || userId || "Gäst"}</p>
    </div>
  );
}

export default LoggedIn;