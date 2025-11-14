import { useState, useEffect } from "react";
import type { Channels, Message } from "../helpers/types";


function Channel () {
  const [channels, setChannels] = useState<Channels[]>([]);  
  const [messages, setMessages] = useState<Message[]>([]);
  const [chosenChannel, setChosenChannel] = useState("");
  const [text, setText] = useState("");

  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelLocked, setNewChannelLocked] = useState(false);

  const jwt = localStorage.getItem("jwt");

  function channelIdFromPk(pk: string) {
    return pk && pk.startsWith("CHANNEL#") ? pk.slice(8) : pk;
  }

  useEffect(() => {
    async function loadChannels() {
    try {
        const sendRes = await fetch("/api/channels");
        const list = await sendRes.json();
        
    if (Array.isArray(list)) {
        setChannels(list);
    } else {
        setMessages([]);
    }

    } catch {
        setChannels([]);
    }
    }
    loadChannels();
  }, []);

  useEffect(() => {
    if (!chosenChannel) return;
    const id = channelIdFromPk(chosenChannel);
    const headers: HeadersInit = jwt ? { Authorization: `Bearer ${jwt}` } : {};


    async function loadMessages() {
    try {
        const sendRes = await fetch(`/api/channels/${id}/messages`, { headers });
        const list = await sendRes.json();

    if (Array.isArray(list)) {
        setMessages(list);  
        
    } else {
    setChannels([]);
    }
        
    } catch {
    setMessages([]);
    }

    }
    loadMessages();
  }, [chosenChannel, jwt]);

  async function sendMessage() {
    const bodyText = text.trim();
    if (!chosenChannel || !bodyText) return;

    const id = channelIdFromPk(chosenChannel);
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    };

    const sendRes = await fetch(`/api/channels/${id}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text: bodyText }),
    });
    if (!sendRes.ok) return;

    setText("");
    const sendRes2 = await fetch(`/api/channels/${id}/messages`, {
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
    });
    setMessages(sendRes2.ok ? await sendRes2.json() : []);
  }


    async function createChannel() {
    const name = newChannelName.trim();
    if (!name || !jwt) return;
    try {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name,
          isLocked: newChannelLocked,
        }),
      });

      if (!res.ok) {
        console.error("Kunde inte skapa kanal");
        return;
      }

      const data = await res.json(); 
      setNewChannelName("");
      setNewChannelLocked(false);

      const sendRes = await fetch("/api/channels");
      const list = await sendRes.json();
      if (Array.isArray(list)) {
        setChannels(list);
      }

      setChosenChannel(`CHANNEL#${data.channelId}`);
    } catch (err) {
      console.error("Fel vid skapande av kanal:", err);
    }
  }




  return (
    <div>
      <h2>Kanaler</h2>

      {jwt && (
        <div className="create-channel-container">
          <input
          className="create-channel"
            id="add-input"
            type="text"
            placeholder="Kanalnamn"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={newChannelLocked}
              onChange={(e) => setNewChannelLocked(e.target.checked)}
            />{" "}
            Låst
          </label>
          <button
            type="button"
            onClick={createChannel}>
            Skapa kanal
          </button>
        </div>
      )}


      <div>
        {channels.map((c: any) => (
          <div key={c.Pk}>
            <button onClick={() => setChosenChannel(c.Pk)}>
              {c.isLocked ? "Låst" : "Öppen"} {c.name || c.Pk}
            </button>
          </div>
        ))}
        {channels.length === 0 && <p>Inga kanaler</p>}
      </div>

      {!chosenChannel && <p>Ingen kanal vald</p>}

      {chosenChannel && (
        <div>
          <h3>Meddelanden</h3>
          {messages.map((m: any) => (
            <div key={m.Sk}>
              <div>
                {(m.senderName || m.senderId || "Okänd")} –{" "}
                {new Date(m.time).toLocaleString()}
              </div>
              <div>{m.text}</div>
            </div>
          ))}
          {messages.length === 0 && <p>Inga meddelanden ännu</p>}

          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv…"
            />
            <button onClick={sendMessage}>Skicka</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Channel;