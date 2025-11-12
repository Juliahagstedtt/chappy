import express from 'express';
import type { Request, Response } from 'express'; 
import db, { myTable } from '../data/dynamoDb.js'
import { ScanCommand, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import jwt from 'jsonwebtoken'

const router = express.Router();

interface ParamOtherUserId {
  otherUserId: string
}

interface DmBody {
  text: string
}

interface Payload {
  userId: string
  accessLevel?: string
}

function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  if (authHeader.startsWith("Bearer: ")) return authHeader.substring(8).trim()
  if (authHeader.startsWith("Bearer ")) return authHeader.substring(7).trim()
  return null
}

function validateJwt(authHeader: string | undefined): Payload | null {
  const token = extractToken(authHeader)
  if (!token) return null
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string; accessLevel?: string }
    const payload: Payload = {
      userId: decoded.userId,
      ...(typeof decoded.accessLevel === 'string' ? { accessLevel: decoded.accessLevel } : {})
    }
    return payload
  } catch {
    return null
  }
}

// api/messages/dm/:otherUserId
router.get('/:otherUserId/messages', async (req: Request<ParamOtherUserId>, res: Response) => {
    const payload = validateJwt(req.headers['authorization'])
    if (!payload) return res.sendStatus(401)

    const me = payload.userId
    const other = req.params.otherUserId
    const sorted = [me, other].sort()
    const pk = `DM#${sorted[0]}#${sorted[1]}`

    try {
      const quCo = new QueryCommand({
            TableName: myTable,
            KeyConditionExpression: "Pk = :pk AND begins_with(Sk, :sk)",
            ExpressionAttributeValues: {
                ":pk": pk,
                ":sk": "MSG#"
            }
            });
      const out = await db.send(quCo)
      res.send(out.Items || [])
    } catch {
      res.status(500).send({ error: 'Fel vid hämtning av DM' })
    }
  });



// Endpoint POST - Skicka direktmeddelande (DM)
router.post('/:otherUserId/messages', async (
    req: Request<ParamOtherUserId, void, DmBody>,
    res: Response
  ) => {
    const payload = validateJwt(req.headers['authorization'])
    if (!payload) return res.sendStatus(401)

    const text = (req.body?.text || '').trim();
    if (!text) return res.status(400).send({ error: 'Ogiltig text' })

    const me = payload.userId
    const other = req.params.otherUserId
    const sorted = [me, other].sort()
    const pk = `DM#${sorted[0]}#${sorted[1]}`
    const iso = new Date().toISOString()

    let senderName = 'User'

    try {
        const sender = await db.send(new ScanCommand({
        TableName: myTable,
        FilterExpression: "#pk = :pk",
        ExpressionAttributeNames: { "#pk": "Pk" },
        ExpressionAttributeValues: { ":pk": `USER#${me}` }
        }))
        const senderItem = sender.Items?.[0]
        senderName = senderItem?.username ?? 'User'

    } catch (error) {
    }   
    
    const item = {
        Pk: pk,
        Sk: `MSG#${iso}`,
        senderId: me,
        receiverId: other,
        senderName,
        text,
        time: iso,
        type: 'dmMessage'
    }

    try {
        await db.send(new PutCommand({ 
            TableName: myTable,
            Item: item 
        }));

    return res.sendStatus(201);

    } catch (error) {
        console.error('ERROR:', error);
        return res.status(500).send({ error: "Fel vid sparning av DM" });
    }
    
});
    
export default router;
