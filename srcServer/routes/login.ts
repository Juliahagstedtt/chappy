import express from 'express';
import db, { myTable } from '../data/dynamoDb.js'
import { userPostSchema, userSchema } from '../data/types.js';
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { compare } from 'bcrypt';
import { createToken } from '../data/Jwt.js';


const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const parsed = userPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ error: "Ogiltigt information" });
    }

    const { username, password } = parsed.data;


  
        const command = new ScanCommand({
            TableName: myTable,
            FilterExpression: "#n = :username",
            ExpressionAttributeNames: { "#n": "username" },
            ExpressionAttributeValues: { ":username": username}
        });
        
    const result = await db.send(command);

    if (!result.Items || result.Items.length === 0) {
        return res.status(404).send({ error: "Användaren finns inte" });
    }

    const user = userSchema.parse(result.Items[0]);

    // TODO: jämföra lösenord med bcrypt
    const match = await compare(password, user.password);
    if (!match) return res.status(401).send({ error: "Fel lösenord" });


    const uuid = user.Pk.startsWith('USER#') ? user.Pk.substring(5) : user.Pk

    // TODO: skapa jwt token
    const token = createToken(uuid);

    // TODO: skicka tillbaka succsess response
    res.status(200).send({
        success: true,
        message: "Inloggningen lyckades",
        userId: uuid,
        token
    });

    // TODO: catch för att fånga fel
    } catch (error) {
        console.error("Login-fel:", error);
      return res.status(500).send({ error: "Något gick fel vid inloggning" });
    }

    
})
    
export default router;

