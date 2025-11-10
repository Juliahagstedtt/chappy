import { useState, useEffect } from "react";
import '../styles/Menu.css';



function Menu () {

const [users, setUsers] = useState([]);
const [channels, SetChannels] = useState([]);

// DM
useEffect(() => {
    fetch('http://localhost:5173/api/users')
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
      {/* {users.map(user => (
        <p key={user.Pk} className="menu-text">{user.username}</p>
      ))} */}

      <h1>Kanaler</h1>
      {/* {channels.map(channel => (
        <p key={channel.Pk} className="menu-text">{channel.name}</p>
      ))} */}
      <p className="menu-text">chetas</p>
      <p className="menu-text">taco-masters</p>
      <p className="menu-text">potter-squad</p>
      <p className="menu-text">bookDorks</p>

</div>
    );
}

export default Menu;