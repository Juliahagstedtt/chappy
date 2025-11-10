import { useEffect, useState } from "react";

const LS_KEY = "jwt";
const LS_USERID = "userId";

function LoggedIn() {
  const jwt = localStorage.getItem(LS_KEY);
  const userId = localStorage.getItem(LS_USERID);
  const username = localStorage.getItem("username");


  useEffect(() => {
    if (!jwt || !userId) return;

    async function fetchUser() {
      const res = await fetch("/api/users");
      const users = await res.json();
      const me = users.find(u => u.userId === userId);
      if (me) setUsername(me.username);
    }
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Inloggad!</h1>
      <p>Välkommen {username || userId}</p>
    </div>
  );
}

export default LoggedIn;