import { useState, useEffect } from "react";
import type { UserListItem, DmMessage} from "../helpers/types";
import { UserListSchema, DmMessageListSchema } from "../helpers/types";

function Dm() {

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [chosenUserId, setChosenUserId] = useState<string>("");
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [text, setText] = useState<string>("");

  const jwt = localStorage.getItem("jwt");
  const isLoggedIn = !!jwt;
  useEffect(() => {
    if (!isLoggedIn) {
      setUsers([]);
      return;
    }

    async function loadUsers() {
      try {
        const headers: HeadersInit = { Authorization: `Bearer ${jwt}` };
        const res = await fetch("/api/users", { headers });
        const data = await res.json();
        const parsed = UserListSchema.safeParse(data)
        setUsers(parsed.success ? parsed.data : []);
      } catch {
        setUsers([]);
      }
    }

    loadUsers();
  }, [isLoggedIn, jwt]);

  useEffect(() => {
    if (!isLoggedIn || !chosenUserId) {
      setMessages([]);
      return;
    }

    async function loadDm() {
      try {
        const headers: HeadersInit = { Authorization: `Bearer ${jwt}` };
        const res = await fetch(`/api/dm/${chosenUserId}/messages`, { headers });
        const data = await res.json();

        const parsed = DmMessageListSchema.safeParse(data);
        setMessages(parsed.success ? parsed.data : []);
      } catch {
        setMessages([]);
      }
    }

    loadDm();
  }, [isLoggedIn, chosenUserId, jwt]);

  async function sendMessage() {
    const bodyText = text.trim();
    if (!isLoggedIn || !chosenUserId || !bodyText) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
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
    <div>
      <h3>Direktmeddelanden</h3>

      <h4>Välj användare</h4>
      <div>
        {users.length === 0 && <p>Inga användare</p>}
        {users.map((u) => (
          <div key={u.userId}>
            <button
              onClick={() => {
                setChosenUserId(u.userId);
                setMessages([]); 
              }}
            >
              {u.username || u.userId}
            </button>
          </div>
        ))}
      </div>

      {!chosenUserId && <p>Välj en användare ovan</p>}

      {chosenUserId && (
        <div>
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

          <div>
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
  );
}

export default Dm;