import { useUserStore } from "../helpers/userStore";



function LoggedIn() {
  const username = useUserStore((s) => s.username);
  const userId = useUserStore((s) => s.userId);

  return (
    <div>
      <h1>Inloggad!</h1>
      <p>Välkommen {username || userId || "Gäst"}</p>
    </div>
  );
}

export default LoggedIn;