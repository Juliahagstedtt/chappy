import { useState, useEffect } from "react";
import type { ChannelItem, ChannelMessage } from "../helpers/types";


function Channel () {
  const [channels, setChannels] = useState([]);
  const [chosenChannel, setChosenChannel] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

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
        setChannels(list);  
    } else {
    setMessages([]);
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

  return (
    <div>
      <h2>Kanaler</h2>

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