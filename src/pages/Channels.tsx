import { useState, useEffect } from "react";


function Channel() {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  

  async function getChannels() {
    setError("");

    try {
      const res = await fetch("/api/channels");
      if (!res.ok) throw new Error("Kunde inte hämta kanaler");

      const data = await res.json();
      console.log("KANALDATA:", data);
      setChannels(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Fel vid hämtning av kanaler");
    }
  }

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div className="channels-container">
      <div className="sidebar">
        <h2>Kanaler</h2>
        <ul className="channel-list">

          {error && <li className="error">{error}</li>}

          {channels.map((c) => (
            <li key={c.Pk}>
              {c.isLocked ? "låst" : "öppen"} {c.name}
            </li>
          ))}

          {channels.length === 0 && !error && <li>Inga kanaler ännu.</li>}
        </ul>
      </div>

      <div className="messages-box">
        <textarea className="message-input" placeholder="Skriv ett meddelande..." />
        <button className="sender">Skicka</button>
      </div>
    </div>
  );
}

export default Channel;