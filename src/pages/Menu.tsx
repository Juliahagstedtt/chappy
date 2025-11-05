import { useState, useEffect } from "react";
import '../styles/Menu.css';



function Menu () {

const [users, setUsers] = useState([]);

useEffect(() => {
    fetch('http://localhost:5173/api/users')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.error(err));
}, []);


return (
<div className="menu-container">
      <h1>DM's</h1>
      {/* {users.map(user => (
        <p key={user.Pk} className="menu-text"> {user.name}</p>
      ))} */}
      <p className="menu-text">chetas</p>
      <p className="menu-text">taco-masters</p>
      <p className="menu-text">potter-squad</p>
      <p className="menu-text">bookDorks</p>

</div>
    );
}

export default Menu;