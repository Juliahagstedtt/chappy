import {  ScanCommand, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import express from 'express';
import type { Request, Response } from 'express'; 
import db, { myTable } from '../data/dynamoDb.js';
import { verifyToken } from "../data/Jwt.js";


const router = express.Router();

// payload från jwt (userId)
interface Payload {
  userId: string;
}

// Funktion för att ta emot Authorization headern (de som innehåller Bearer token)
// Här förösker veriferar med functionen för att returnera payload (användarens id) 
function validateJwt(authHeader?: string): Payload | null { // Om token saknas eller är ogilltig ret null

    if (!authHeader) return null; // Retur null om inte authorization header finns

    // här delas upp den på mellanslaget och tar andra delen, alltså själva token-strängen
    const token = authHeader.split(' ')[1] ?? '';
    if (!token) return null; // retur null om token inte finns 

    // funktionen kontrollerar att jwt är korrekt
    try {
        const payload = verifyToken(token);
        return { userId: payload.userId }; // retur användarens payload (vilket är ett objekt med användarens id)
    } catch {
        return null; // Om fel uppstår retur null (användare blir behnadlad som gäst)
    }
}


// GET - Hämta alla kanaler (öppna + låsta) (även tillänglig för gäster)
router.get('/', async (req: Request, res: Response) => {
    try { // Hämtar hela db tebellen med Scan
        const data = await db.send(new ScanCommand({ TableName: myTable }));

        // filterar bort allt som inte är kanal info
        // alla kanaler som har Pk börjar med CHANNEL# och Sk med INFO (TODO: Ändra INFO!)
        const channels = (data.Items || []).filter(item => {
            return item.Pk?.startsWith("CHANNEL#") && item.Sk === "INFO";
        });

      // Skickar tillbaka listan av kanaler
      return res.status(200).send(channels);

      // Om något går fel error mess och 500 server error
    } catch (err) {
        console.error('ERROR:', err); 
        res.status(500).send({ error: "Fel vid hämtning av kanal" });
    }
    })



  // GET id - Hämta meddelanden i en kanal
  router.get('/:channelId/messages', async (req: Request, res: Response) => {

    try {
      // hämtar ut kanalens id från url parametern
        const { channelId } = req.params;

        // Kontrollera att kanalen finns i databasen
        const infoQuery = new QueryCommand({
        // hämtar kanalens 
        TableName: myTable, 
        KeyConditionExpression: '#Pk = :pk AND #Sk = :sk',
        ExpressionAttributeNames: { '#Pk': 'Pk', '#Sk': 'Sk' },
        ExpressionAttributeValues: {
            ':pk': `CHANNEL#${channelId}`,
            ':sk': 'INFO',
            }
        });
        const infoOut = await db.send(infoQuery); // skickar QueryCommand till DynamoDB och väntar på svaret

        // hämtar info om kanalen
        const channel = infoOut.Items?.[0];
        if (!channel) return res.sendStatus(404); // om kanalen inte finns retur 404

        // här kontrollerar de om användaren är inloggad, genom att validera jwt token i headern
        const loggedIn = validateJwt(req.headers.authorization) !== null;

        // om kanalen är låst och användaren inte är inloggad return 401
        if (channel.isLocked === true && !loggedIn) return res.sendStatus(401);

        // ny frågan om att hämta alla meddelanden i kanalen
        const messageQuery = new QueryCommand({
        TableName: myTable,
        KeyConditionExpression: '#Pk = :pk AND begins_with(#Sk, :sk)',
        ExpressionAttributeNames: { '#Pk': 'Pk', '#Sk': 'Sk' },
        ExpressionAttributeValues: {
            ':pk': `CHANNEL#${channelId}`,
            ':sk': 'MSG#',
        },
        });

        // skickar till db för att hämta alla meddelanden
        const messageOut = await db.send(messageQuery);

        // kontrollerar att items är en array, annars tom lista
        const messages = Array.isArray(messageOut.Items) ? messageOut.Items : [];

       // skickar tillbaka listan av meddelanden till frontend
        return res.send(messages);

    } catch (err) {
      // Fel loggas i terminalen
        console.error('ERROR:', err);

        // Fel meddelande 500
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

      // Hämta kanalens info baserat på nyckeln CHANNEL#<id> och Sk
      const infoQuery = new QueryCommand({
        TableName: myTable,
        KeyConditionExpression: '#Pk = :pk AND #Sk = :sk',
        ExpressionAttributeNames: { '#Pk': 'Pk', '#Sk': 'Sk' },
        ExpressionAttributeValues: {
          ':pk': `CHANNEL#${channelId}`,
          ':sk': 'INFO',
          }
      });
      const infoOut = await db.send(infoQuery); // Skickar till db

      // Om ingen info hittas return 404
      const channel = infoOut.Items?.[0];
      if (!channel) return res.sendStatus(404);

      // Kontrollerar om användaren är inloggad
      const loggedIn = validateJwt(req.headers.authorization) !== null;

      // om kanalen är låst är användaren inte inloggad (return 401 unauth)
      if (channel.isLocked === true && !loggedIn) return res.sendStatus(401);

      // hämta payload om userId finns
      const payload = validateJwt(req.headers.authorization);

      let sendName = 'Guest'; // Gäst

      if (payload) {
        // hämta användaren från DynamoDB
        const userQ = await db.send(new ScanCommand({
            TableName: myTable,
            FilterExpression: "#pk = :pk",
            ExpressionAttributeNames: { "#pk": "Pk" },
            ExpressionAttributeValues: { ":pk": `USER#${payload.userId}` }
        }));

        const userItem = userQ.Items?.[0];
        sendName = userItem?.username ?? 'User';
      }


      // skapar item för meddelandet
      const isoString = new Date().toISOString();
      const item = {
        Pk: `CHANNEL#${channelId}`,
        Sk: `MSG#${isoString}`,
        text,
        time: isoString,
        senderId: loggedIn ? payload!.userId : 'GUEST',
        senderName: sendName,
        type: 'channelMessage',
      };

      // spara i DynamoDB
      await db.send(new PutCommand({
        TableName: myTable,
        Item: item,
      }));

      return res.status(201).send(item); //201 Created (return det som sparats)
    } catch (err) {
      console.error('ERROR:', err);
      return res.status(500).send({ error: 'Fel vid sparning av meddelande' });
    }
  })
 
export default router;