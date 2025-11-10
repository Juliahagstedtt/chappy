import {  ScanCommand, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import express from 'express';
import type { Request, Response } from 'express'; 
import db, { myTable } from '../data/dynamoDb.js';
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
        console.log('PAYLOAD:', payload);
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

        const data = await db.send(new ScanCommand({ TableName: myTable }));

        const channels = (data.Items || []).filter(item => {
            return item.Pk?.startsWith("CHANNEL#") && item.Sk === "INFO";
        });

        const filtered = channels.filter(channel => {
            if (channel.isLocked === true) {
                return isLoggedIn;
            }
            return true;
        });

        res.send(filtered);

    } catch (err) {
        console.error('[channels] ERROR:', err); 
        res.status(500).send({ error: "Fel vid hämtning av kanal" });
    }
    })





// GET id - Hämta meddelanden i en kanal

router.get('/:channelId/messages', async (req: Request, res: Response) => {

    try {
        const { channelId } = req.params;

        const infoQ = new QueryCommand({
        TableName: myTable, 
        KeyConditionExpression: '#Pk = :pk AND #Sk = :sk',
        ExpressionAttributeNames: { '#Pk': 'Pk', '#Sk': 'Sk' },
        ExpressionAttributeValues: {
            ':pk': `CHANNEL#${channelId}`,
            ':sk': 'INFO',
            }
        });
        const infoOut = await db.send(infoQ);
        const channel = infoOut.Items?.[0];
        if (!channel) return res.sendStatus(404);

        const loggedIn = validateJwt(req.headers.authorization) !== null;
        if (channel.isLocked === true && !loggedIn) return res.sendStatus(401);

        const msgQuery = new QueryCommand({
        TableName: myTable,
        KeyConditionExpression: '#Pk = :pk AND begins_with(#Sk, :sk)',
        ExpressionAttributeNames: { '#Pk': 'Pk', '#Sk': 'Sk' },
        ExpressionAttributeValues: {
            ':pk': `CHANNEL#${channelId}`,
            ':sk': 'MSG#',
        },
        });
        const msgOut = await db.send(msgQuery);
        const messages = Array.isArray(msgOut.Items) ? msgOut.Items : [];

        return res.send(messages);
    } catch (err) {
        console.error('[channels/:id/messages] ERROR:', err);
        return res.status(500).send({ error: 'Fel vid hämtning av meddelanden' });
    }
});

// POST id - Skicka meddelande till kanal
router.post('/:channelId/messages', async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const { text, senderName } = req.body ?? {};

    if (typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).send({ error: 'Ogiltig text' });
    }

    // 1) Hämta kanalens INFO
    const infoQ = new QueryCommand({
      TableName: myTable,
      KeyConditionExpression: '#Pk = :pk AND #Sk = :sk',
      ExpressionAttributeNames: { '#Pk': 'Pk', '#Sk': 'Sk' },
      ExpressionAttributeValues: {
        ':pk': `CHANNEL#${channelId}`,
        ':sk': 'INFO',
        }
    });
    const infoOut = await db.send(infoQ);
    const channel = infoOut.Items?.[0];
    if (!channel) return res.sendStatus(404);

    const payload = validateJwt(req.headers.authorization);
    const loggedIn = payload !== null;
    if (channel.isLocked === true && !loggedIn) return res.sendStatus(401);

    const isoStri = new Date().toISOString();
    const item = {
      Pk: `CHANNEL#${channelId}`,
      Sk: `MSG#${isoStri}`,
      message: text,
      time: isoStri,
      senderId: loggedIn ? payload!.userId : 'GUEST',
      senderName: typeof senderName === 'string' && senderName.trim() ? senderName : (loggedIn ? 'User' : 'Guest'),
      type: 'channelMessage',
    };

    await db.send(new PutCommand({
      TableName: myTable,
      Item: item,
    }));

    return res.status(201).send(item);
  } catch (err) {
    console.error('[post channel message] ERROR:', err);
    return res.status(500).send({ error: 'Fel vid sparning av meddelande' });
  }
    
})


    
export default router;
