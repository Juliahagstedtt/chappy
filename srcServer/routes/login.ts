import express from 'express';
import db, { myTable } from '../data/dynamoDb.js'
import { userPostSchema } from '../data/validation.js';
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { error } from 'console';


const router = express.Router();

router.post('/login', async (req, res) => {

    // TODO: Hämta email och lösenord
    // TODO: validera email och lösenord med zod (finns redan)

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
            ExpressionAttributeValues: { "username": username }
        });
        
    const result = await db.send(command);

    if (!result.Items || result.Items.length === 0) {
        return res.status(404).send({ error: "Användaren finns inte" });
    }
        const user = result.Items[0];
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Något gick fel vid inloggning" });
    }


    // TODO: jämföra lösenord med bcrypt
    // TODO: skapa jwt token
    // TODO: skapa user id
    // TODO: skicka tillbaka succsess response
    // TODO: catch för att fånga fel


    
})
    
export default router;

