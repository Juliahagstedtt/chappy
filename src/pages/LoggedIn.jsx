import React from 'react';

function LoggedIn({ username }) {
  return (
    <div>
      <h1>Inloggad!</h1>
      <p>Välkommen, {username}!</p>
    </div>
  );
}

export default LoggedIn;