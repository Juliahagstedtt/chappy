import { useState, useEffect } from "react";


const LS_KEY = "jwt";

function Dm() {
  const [dm, setDm] = useState([]);
  const [activePk, setActivePk] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const dmIdFromPk = (pk) =>
    pk && pk.startsWith("DM#") ? pk.slice(8) : pk || "";

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/dm");
      const data = await res.json();
      setDm(data);
      if (data.length > 0) setActivePk(data[0].Pk);
    })();
  }, []);

  useEffect(() => {
    if (!activePk) return;
    (async () => {
      const id = dmIdFromPk(activePk);
      const jwt = localStorage.getItem(LS_KEY);
      const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
      const res = await fetch(`/api/dm/${id}/messages`, { headers });
      setMessages(res.ok ? await res.json() : []);
    })();
  }, [activePk]);

  async function sendMessage() {
    if (!activePk || !text.trim()) return;
    const id = dmIdFromPk(activePk);
    const jwt = localStorage.getItem(LS_KEY);
    const headers = { "Content-Type": "application/json" };
    if (jwt) headers.Authorization = `Bearer ${jwt}`;
    const res = await fetch(`/api/dm/${id}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setText("");
      // hämta om messages kort och gott
      const res2 = await fetch(`/api/dm/${id}/messages`, { headers });
      setMessages(res2.ok ? await res2.json() : []);
    }
  }

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <aside>
        <h3>Dm</h3>
        <ul>
          {dm.map((c) => (
            <li key={c.Pk}>
              <button onClick={() => setActivePk(c.Pk)}>
                {c.isLocked ? "låst" : "öppen"} {c.name || c.Pk}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main style={{ flex: 1 }}>
        {!activePk && <div>Välj en kanal.</div>}
        {activePk && (
          <>
            <ul>
              {messages.map((m) => (
                <li key={m.Sk}>
                  <small>
                    {(m.senderName || m.senderId || "Okänd")} –{" "}
                    {new Date(m.time).toLocaleString()}
                  </small>
                  <div>{m.text}</div>
                </li>
              ))}
              {messages.length === 0 && <li>Inga meddelanden ännu.</li>}
            </ul>
            <div style={{ marginTop: 8 }}>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Skriv ett meddelande…"
                style={{ width: "100%" }}
              />
              <button onClick={sendMessage}>Skicka</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dm;