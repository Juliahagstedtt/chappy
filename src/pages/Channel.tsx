import { useState, useEffect } from "react";
import "../styles/channels.css";
import type { Channels, Message } from "../helpers/types";
import { useUserStore } from "../helpers/userStore";

const API = "/api";

function Channel () {
  const [channels, setChannels] = useState<Channels[]>([]);  
  const [messages, setMessages] = useState<Message[]>([]);
  const [chosenChannel, setChosenChannel] = useState("");
  const [text, setText] = useState("");

  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelLocked, setNewChannelLocked] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);


  const token = useUserStore((s) => s.token);
  const userId = useUserStore((s) => s.userId);
  const currentChannel = channels.find(c => c.Pk === chosenChannel);
  const isOwner = currentChannel?.createdBy === userId;

  function channelIdFromPk(pk: string) {
    return pk && pk.startsWith("CHANNEL#") ? pk.slice(8) : pk;
  }

  useEffect(() => {
    async function loadChannels() {
    try {
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const sendRes = await fetch(`${API}/channels`, {
          headers,
        });

      const list = await sendRes.json();
        
    if (Array.isArray(list)) {
        setChannels(list);
    } else {
        setChannels([]);
    }

    } catch {
        setChannels([]);
    }
    }
    loadChannels();
}, [token]);
  
  useEffect(() => {
    if (!chosenChannel) return;
    const id = channelIdFromPk(chosenChannel);
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};


    async function loadMessages() {
    try {

      const res = await fetch(`/api/channels/${id}/messages`, {
        headers,
      });

  if (res.status === 401) {
      console.log("Kan inte öppna en låst kanal utan att vara inloggad.");
      setMessages([]);
      return;
    }


    if (!res.ok) {
      console.log("Fel vid hämtning av meddelanden. Status:", res.status);
      setMessages([]);
      return;
    }

    const list = await res.json();

    if (Array.isArray(list)) {
        setMessages(list);  
        
    } else {
    setMessages([]);
    }
        
    } catch {
    setMessages([]);
    }

    }
    loadMessages();
  }, [chosenChannel, token]);

  async function sendMessage() {
    const bodyText = text.trim();
    if (!chosenChannel || !bodyText) return;

    const id = channelIdFromPk(chosenChannel);
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`/api/channels/${id}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ text: bodyText }),
      });

    if (!res.ok) return;

    setText("");
    const sendRes2 = await fetch(`${API}/channels/${id}/messages`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setMessages(sendRes2.ok ? await sendRes2.json() : []);
  }


    async function createChannel() {
    const name = newChannelName.trim();
    if (!name || !token) return;
    try {
      const res = await fetch(`/api/channels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, isLocked: newChannelLocked }),
      });

      if (!res.ok) {
        console.error("Kunde inte skapa kanal");
        return;
      }

      const data = await res.json(); 
      setNewChannelName("");
      setNewChannelLocked(false);

      const sendRes = await fetch(`${API}/channels`);
      const list = await sendRes.json();
      if (Array.isArray(list)) {
        setChannels(list);
      }

      setChosenChannel(`CHANNEL#${data.channelId}`);
    } catch (err) {
      console.error("Fel vid skapande av kanal:", err);
    }
  }


async function deleteChannel() {
    if (!chosenChannel || !token) return;

    const id = channelIdFromPk(chosenChannel);

    try {
      const res = await fetch(`${API}/channels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        setChannels((prev) => prev.filter((c) => c.Pk !== chosenChannel));
        setChosenChannel("");
        setMessages([]);
      } else {
        console.error("Kunde inte ta bort kanal, status:", res.status);
      }
    } catch (err) {
      console.error("Fel vid borttagning av kanal:", err);
    }
  }

 return (
    <div className="channel-container">
      <h2>Kanaler</h2>
        <div className="channel-wrapper">
        <div className="channel-channels">
          {token && !showCreateNew && (
            <button
              type="button"
              onClick={() => setShowCreateNew(true)}>
              Lägg till +
            </button>
          )}

  {token && showCreateNew && (
    <div className="create-channel-container">
      <input
        className="create-channel"
        id="add-input"
        type="text"
        placeholder="Kanalnamn"
        value={newChannelName}
        onChange={(e) => setNewChannelName(e.target.value)}
      />
      <label className="channel-locked">
        Låst
        <input
          type="checkbox"
          checked={newChannelLocked}
          onChange={(e) => setNewChannelLocked(e.target.checked)}
        />
        
      </label>
      <button type="button" onClick={createChannel}>
        Skapa kanal
      </button>
      <button
        type="button"
        onClick={() => setShowCreateNew(false)}
      >
        Avbryt
      </button>
    </div>
  )}
          <ul className="channel-list">
            {channels.map((c: Channels) => (
              <li key={c.Pk}>
                <button onClick={() => setChosenChannel(c.Pk)}>
                  {c.isLocked ? "Låst" : "Öppen"} {c.name || c.Pk}
                </button>
              </li>
            ))}
          </ul>

          {channels.length === 0 && <p>Inga kanaler</p>}
        </div>

        <div className="channel-chat">
          {!chosenChannel && <p>Ingen kanal vald</p>}

          {chosenChannel && (
            <>
              <h4>Meddelanden</h4>

              {messages.map((m: Message) => (
                <div key={m.Sk}>
                  <div>
                    {(m.senderName || m.senderId || "Okänd")} –{" "}
                    {new Date(m.time).toLocaleString()}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}

              {messages.length === 0 && <p>Inga meddelanden ännu</p>}

              <div className="channel-text">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Skriv…"
                />
                <button onClick={sendMessage}>Skicka</button>
              </div>

            {token && isOwner && (
              <button
                type="button"
                className="channel-delete"
                onClick={deleteChannel}
              >
                Ta bort denna kanal
              </button>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Channel;