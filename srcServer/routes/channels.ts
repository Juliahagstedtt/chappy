import express from 'express';
import type { Request, Response } from 'express'; 
import db, { myTable } from '../data/dynamoDb.js';
import {  ScanCommand } from '@aws-sdk/lib-dynamodb';
// import type { AuthRequest } from '../data/middleware.js';
import { verifyToken } from "../data/Jwt.js";


const router = express.Router();


interface Payload {
  userId: string;
}


function validateJwt(authHeader?: string): Payload | null {
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1] ?? '';
    if (!token) return null;

    try {
        const payload = verifyToken(token);
        return { userId: payload.userId };
    } catch {
        return null;
    }
}

// GET - Hämta alla kanaler (öppna + låsta)

router.get('/', async (req: Request, res: Response) => {
    try {
        const payload = validateJwt(req.headers.authorization);
        const isLoggedIn = payload !== null;

        const data = await db.send(new ScanCommand({ TableName: 'chappy' }));

        // 1. Ta bara kanalrader
        const channels = (data.Items || []).filter(item => {
            return item.Pk?.startsWith("CHANNEL#") && item.Sk === "INFO";
        });

        // 2. Filtrera låsta
        const filtered = channels.filter(channel => {
            if (channel.isLocked === true) {
                return isLoggedIn;
            }
            return true;
        });

        res.send(filtered);

    } catch (err) {
        res.status(500).send({ error: "Fel vid hämtning av kanal" });
    }
    })





// GET id - Hämta meddelanden i en kanal

router.get('/:channelId/messages', async (req: Request, res: Response) => {
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
router.post('/:channelId/messages', async (req: Request, res: Response) => {

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
