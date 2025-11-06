import express from 'express';
import type { Request, Response } from 'express'; 
import db, { myTable } from '../data/dynamoDb.js'
import {  ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { AuthRequest } from '../data/middleware.js';


const router = express.Router();


// GET - Hämta alla kanaler (öppna + låsta)

export interface AuthRequest extends Request {
  user: { userId: string } | null;
}


router.get('/api/channels', async (req: AuthRequest, res: Response) => {
    try {
        const data = await db.send(new ScanCommand({ 
            TableName: "channel" 
        }));
        
    const channels = data.Items || [];
    
    const filtered = channels.filter(channel => {
        if(channel.locked === true) {
            return req.user !== null;
        }
        return true;
    });

    return res.send(filtered);

    } catch (err) {
        res.status(500).send({ error: "Fel vid hämtning av kanal" });
    }
})





// GET id - Hämta meddelanden i en kanal

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







// POST id - Skicka meddelande till kanal
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
