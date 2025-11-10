import { useState, useEffect } from "react";
import '../styles/Menu.css';



function Menu () {

const [users, setUsers] = useState([]);
const [channels, SetChannels] = useState([]);

// DM
useEffect(() => {
    fetch('http://localhost:5173/api/dm')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.error(err));
}, []);

// Channel
useEffect(() => {
    fetch('http://localhost:5173/api/channels')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.error(err));
}, []);


return (
<div className="menu-container">
      <h1>Channel</h1>
      <h1>DM's</h1>
      {users.map(user => (
        <p key={user.Pk} className="menu-text">{user.username}</p>
      ))}

      <h1>Kanaler</h1>
        <ul>
          {channels.map((c) => (
            <li key={c.Pk}>
              <button onClick={() => setActivePk(c.Pk)}>
                {c.isLocked ? "låst" : "öppen"} {c.name || c.Pk}
              </button>
            </li>
          ))}
        </ul>
</div>
    );
}

export default Menu;