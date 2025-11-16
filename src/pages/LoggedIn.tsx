import { useUserStore } from "../helpers/userStore";
import chatbubbles from "../assets/chat.webp";



function LoggedIn() {
  const username = useUserStore((s) => s.username);
  const userId = useUserStore((s) => s.userId);

  return (
    <div>
      <h1>Inloggad!</h1>
      <p>Välkommen {username || userId || "Gäst"}</p>
      <img src={chatbubbles} alt="chat" className="bubbles" />

    </div>
  );
}

export default LoggedIn;