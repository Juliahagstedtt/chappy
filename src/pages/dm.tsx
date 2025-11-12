// import { useState } from "react";

function Dm() {

  return (
    <div>
      <h3>Direktmeddelanden</h3>

      <h3>Välj användare</h3>

      <button>username</button>

      <p>Välj en användare ovan</p>

        <h3>Konversation</h3>
        <p>Inga meddelanden ännu</p>

          <div>
            <textarea
              placeholder={ "Skriv ett meddelande…"}>
              </textarea>

            <button>Skicka</button>
          </div>
    </div>
  );
}

export default Dm;