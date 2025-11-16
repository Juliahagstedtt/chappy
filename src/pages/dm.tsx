import { useState, useEffect } from "react";
import type { UserListItem, DmMessage} from "../helpers/types";
import { UserListSchema, DmMessageListSchema } from "../helpers/types";
import "../styles/dm.css";
import { useUserStore } from "../helpers/userStore";



function Dm() {

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [chosenUserId, setChosenUserId] = useState<string>("");
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [text, setText] = useState<string>("");

const token = useUserStore((s) => s.token);
const currentUserId = useUserStore((s) => s.userId);


  const isLoggedIn = !!token;
  useEffect(() => {
    if (!isLoggedIn) {
      setUsers([]);
      return;
    }

    async function loadUsers() {
      try {
        const headers: HeadersInit = { Authorization: `Bearer ${token}` };
        const res = await fetch("/api/users", { headers });
        const data = await res.json();
        const parsed = UserListSchema.safeParse(data)
      
        const filtered = parsed.success
        ? parsed.data.filter(u => u.userId !== currentUserId)
        : [];

      setUsers(filtered);
    } catch {
      setUsers([]);
    }
  }

    loadUsers();
  }, [isLoggedIn, token, currentUserId]);

  useEffect(() => {
    if (!isLoggedIn || !chosenUserId) {
      setMessages([]);
      return;
    }

    async function loadDm() {
      try {
        const headers: HeadersInit = { Authorization: `Bearer ${token}` };
        const res = await fetch(`/api/dm/${chosenUserId}/messages`, { headers });
        const data = await res.json();

        const parsed = DmMessageListSchema.safeParse(data);
        setMessages(parsed.success ? parsed.data : []);
      } catch {
        setMessages([]);
      }
    }

    loadDm();
  }, [isLoggedIn, chosenUserId, token]);

  async function sendMessage() {
    const bodyText = text.trim();
    if (!isLoggedIn || !chosenUserId || !bodyText) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const sent = await fetch(`/api/dm/${chosenUserId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text: bodyText }),
    });
    if (!sent.ok) return;

    setText("");

    const res = await fetch(`/api/dm/${chosenUserId}/messages`, { headers });
    const data = res.ok ? await res.json() : [];
    const parsed = DmMessageListSchema.safeParse(data);
    setMessages(parsed.success ? parsed.data : []);
  }

  if (!isLoggedIn) {
    return (
      <div>
        <h3>Direktmeddelanden</h3>
        <p>Du måste vara inloggad för att skicka och läsa DM.</p>
      </div>
    );
  }

   return (
    <div className="dm-container">
      <h2>Direktmeddelanden</h2>

<div className="dm-wrapper">
    <div className="dm-users">
      {!chosenUserId && <h4>Välj en användare</h4>}
      {users.length === 0 && <p>Inga användare</p>}
      <ul className="user-list">
        {users.map((u) => (
          <li key={u.userId}>
            <button
              onClick={() => {
                setChosenUserId(u.userId);
                setMessages([]);
              }}
            >
              {u.username || u.userId}
            </button>
          </li>
        ))}
      </ul>
    </div>
    

      {chosenUserId && (
        <div className="dm-chat">
          <h4>Konversation</h4>

          {messages.length === 0 && <p>Inga meddelanden ännu</p>}

          {messages.map((m) => (
            <div key={m.Sk}>
              <div>
                {(m.senderName || m.senderId)} — {new Date(m.time).toLocaleString()}
              </div>
              <div>{m.text}</div>
            </div>
          ))}

          <div className="dm-text">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv ett meddelande…"
            />
            <button onClick={sendMessage}>Skicka</button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default Dm;