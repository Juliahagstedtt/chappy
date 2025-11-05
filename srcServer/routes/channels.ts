import express from 'express';
import db, { myTable } from '../data/dynamoDb.js'


const router = express.Router();

// GET - Hämta alla kanaler (öppna + låsta)

// GET id - Hämta meddelanden i en kanal

// POST id - Skicka meddelande till kanal

router.get('/api/channels', async (req, res) => {

// TODO: Hämta alla kanaler från DB

// TODO: Filtrera baserat på behörighet:
//          Om kanalen är låst kontrollera om man är inloggad
//          Gäster kan bara se öppna kanaler

// TODO: Returnera resultatet

// TODO: Ev sortera/filtera kanaler 
})



router.get('/api/channels/:channelId/messages', async (req, res) => {
// TODO: Hämta kanalens id från url param

// TODO: Kolla så kanalen finns annars returnera 404

// TODO: Kontrollera behörighet:
//          Om kanalen är låst kontrollera om man är inloggad
//          Gäster kan bara se öppna kanaler (kan inte se låsta kanaler)



// TODO: Hämta meddelande från DB

// TODO: Returnera meddelande

// TODO: Error message response 
})




router.post('/api/channels/:channelId/messages', async (req, res) => {

// TODO: hämta Kanalens id från url param

// TODO: hämta message data från req body

// TODO: kolla att kanalen finns annars returnera 404

// TODO: Kontrollera behörighet:
//          Om kanalen är låst kontrollera om man är inloggad
//          Gäster kan bara se öppna kanaler (kan inte se låsta kanaler)

// TODO: Spara meddelande i DB

// TODO: Returnera de sparade meddelandet eller returnera bekfräftelse

// TODO: Error message response 

    
})


    
export default router;
