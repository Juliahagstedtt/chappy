import express from 'express';
import db, { myTable } from '../data/dynamoDb.js'
import { userPostSchema } from '../data/validation.js';
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { compare } from 'bcrypt';
import { createToken } from '../data/auth.js';


const router = express.Router();

router.post('/login', async (req, res) => {

    // TODO: Hämta username och lösenord
    // TODO: validera username och lösenord med zod (finns redan)

    const parsed = userPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ error: "Ogitligt information" });
    }

    const { username, password } = parsed.data;

    // TODO: hämta användare från DB
    try {
        const command = new ScanCommand({
            TableName: myTable,
            FilterExpression: "name = :username",
            ExpressionAttributeValues: { ":username": username}
        });
        
    const result = await db.send(command);

    if (!result.Items || result.Items.length === 0) {
        return res.status(404).send({ error: "Användaren finns inte" });
    }
        user = result.Items[0];
    } catch (error) {
        console.error(error);
      return res.status(500).send({ error: "Något gick fel vid inloggning" });
    }

    // TODO: jämföra lösenord med bcrypt
    const match = await compare(password, user.password);
    if (!match) return res.status(401).send({ error: "Fel lösenord" });

    // TODO: skapa jwt token
    const token = createToken(user.Pk);

    // TODO: skapa user id
    // TODO: skicka tillbaka succsess response
    // TODO: catch för att fånga fel


    
})
    
export default router;

