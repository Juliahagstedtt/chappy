import {  ScanCommand, QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import express from 'express';
import type { Response } from 'express';
import type { AuthRequest } from '../data/middleware.js';
import db, { myTable } from '../data/dynamoDb.js';
import { checkLogin } from '../data/middleware.js';
import crypto from "crypto";

const router = express.Router();

// GET - Hämta alla kanaler (öppna + låsta) (även tillänglig för gäster)
router.get('/', async (req: AuthRequest, res: Response) => {
    try { // Hämtar hela db tebellen med Scan
        const data = await db.send(new ScanCommand({ TableName: myTable }));

        // filterar bort allt som inte är kanal info
        // alla kanaler som har Pk börjar med CHANNEL# och Sk med INFO
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
  router.get('/:channelId/messages', checkLogin, async (req: AuthRequest, res: Response) => {

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
        const loggedIn = !!req.user;

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
  router.post('/:channelId/messages', checkLogin, async (req: AuthRequest, res: Response) => {
    try {
      const { channelId } = req.params;
      const { text } = req.body ?? {};

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
      const loggedIn = !!req.user;

      // om kanalen är låst är användaren inte inloggad (return 401 unauth)
      if (channel.isLocked === true && !loggedIn) return res.sendStatus(401);

      
      const payload = req.user;

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


  // POST - Skapa ny kanal (endast inloggad användare kan göra det)
router.post('/',  checkLogin, async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).send({ error: "Du måste vara inloggad." });
    }
    const payload = req.user;

    const { name, isLocked } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).send({ error: "Ogiltigt kanalnamn." });
    }

    const locked = Boolean(isLocked); 

    const channelId = crypto.randomUUID();
    const now = new Date().toISOString();

    const item = {
      Pk: `CHANNEL#${channelId}`,
      Sk: "INFO",
      name: name.trim(),
      isLocked: locked,
      type: "channel",
      createdAt: now,
      createdBy: payload.userId,
    };

    await db.send(new PutCommand({
      TableName: myTable,
      Item: item,
    }));

    return res.status(201).send({
      channelId,
      name: item.name,
      isLocked: item.isLocked,
      createdAt: item.createdAt,
      createdBy: item.createdBy,
    });
  } catch (err) {
    console.error("ERROR vid skapande av kanal:", err);
    return res.status(500).send({ error: "Fel vid skapande av kanal." });
  }
});



 
// DELETE - Ta bort kanal endast skaparen kan det
router.delete('/:channelId', checkLogin, async (req: AuthRequest, res: Response) => {
  const payload = req.user!;

  try {
      if (!req.user) {
      return res.status(401).send({ error: "Du måste vara inloggad." });
    }

    const { channelId } = req.params;

    const infoQuery = new QueryCommand({
      TableName: myTable,
      KeyConditionExpression: '#Pk = :pk AND #Sk = :sk',
      ExpressionAttributeNames: { '#Pk': 'Pk', '#Sk': 'Sk' },
      ExpressionAttributeValues: {
        ':pk': `CHANNEL#${channelId}`,
        ':sk': 'INFO',
      },
    });

    const infoOut = await db.send(infoQuery);
    const channel = infoOut.Items?.[0];

    if (!channel) {
      return res.sendStatus(404); 
    }
    
    console.log("PAYLOAD från token:", payload);
    console.log("CREATED BY i kanalen:", channel.createdBy);

    if (channel.createdBy !== payload.userId) {
      return res
        .status(403)
        .send({ error: "Du kan bara ta bort kanaler som du har skapat." });
    }

    const allItemsQuery = new QueryCommand({
      TableName: myTable,
      KeyConditionExpression: '#Pk = :pk',
      ExpressionAttributeNames: { '#Pk': 'Pk' },
      ExpressionAttributeValues: {
        ':pk': `CHANNEL#${channelId}`,
      },
    });

    const allItemsOut = await db.send(allItemsQuery);
    const items = allItemsOut.Items ?? [];

    for (const item of items) {
      await db.send(
        new DeleteCommand({
          TableName: myTable,
          Key: {
            Pk: item.Pk,
            Sk: item.Sk,
          },
        })
      );
    }

    return res.sendStatus(204); 
  } catch (err) {
    console.error("ERROR vid borttagning av kanal:", err);

    return res
      .status(500)
      .send({ error: "Fel vid borttagning av kanal." });
      
  }
});





export default router;