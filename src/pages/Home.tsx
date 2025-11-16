import "../styles/Home.css";
import chatbubbles from "../assets/chat.webp";

function Home() {
 
  return (
    <div className="home-container">
      <h1>Välkommen till Chappy!</h1>
      <p>Chatta med vänner på ett enkelt och tryggt sätt.</p> 
      <img src={chatbubbles} alt="chat" className="bubbles" />
    </div>
  );
}

export default Home;