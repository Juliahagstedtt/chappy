import express from 'express';
import { genSalt, hash } from "bcrypt";
import crypto from "crypto";
import db, { myTable } from '../data/dynamoDb.js';
import { userPostSchema } from '../data/types.js';
import { PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { createToken } from '../data/Jwt.js';
import { checkLogin } from '../data/middleware.js';
import type { AuthRequest } from "../data/middleware.js";


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: myTable,
            FilterExpression: "begins_with(Pk, :userPrefix)",
            ExpressionAttributeValues: {
                ":userPrefix": "USER#"
            }
        });

        const result = await db.send(command);

        const users = (result.Items || []).map(item => ({
            username: item.username,
            userId: item.Pk.replace("USER#", "")
        }));

        res.status(200).send(users);

    } catch (error) {
        console.error("Fel vid hämning av användare", error);
        res.status(500).send({ error: "kunde inte hämta användaren" });
    }
});



router.post('/register', async (req, res) => {
    
    const parsed = userPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ error: "Ogitligt information" });
    }

    const { username, password } = parsed.data;
    
    // TODO: Skapa unikt ID
    const userId = crypto.randomUUID();

    // TODO: Hasha lösenordet med bcrypt
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    // TODO: Fixa objektet som ska sparas i DynamoDB
    const userItem = {
        Pk: `USER#${userId}`,
        Sk: `INFO`,
        username: username,
        password: hashedPassword,
        type: 'user',
    };

        // Kolla om användarnamnet redan finns
        const exists = await db.send(new ScanCommand({
            TableName: myTable,
            FilterExpression: "#u = :u",
            ExpressionAttributeNames: { "#u": "username" },
            ExpressionAttributeValues: { ":u": username }
        }));

        if ((exists.Items ?? []).length > 0) {
            return res.status(409).send({ error: "Användarnamnet är upptaget" });
        }

    // TODO: Spara användaren i DynamoDB
    try {
        const command = new PutCommand({
            TableName: myTable,
            Item: userItem
        });

        await db.send(command);

        // TODO skapa JWT token senare
        const token = createToken(userId);

        // TODO: Response till frontend 
        res.status(201).send({
            success: true,
            message: "Användare skapad",
            userId: userId,
            token
        });

    } catch (error) {
        console.log('Fel vid sparning', error);
        return res.status(500).send({ error: 'Kunde inte spara användrae i DynamoDB' });
    }

});


router.delete("/:id", checkLogin, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ error: "Du måste vara inloggad." });
    }

    const id = req.params.id;

    if (id !== req.user.userId) {
      return res.status(403).send({ error: "Du kan bara ta bort ditt eget konto." });
    }

    const pk = `USER#${id}`;

    const command = new DeleteCommand({
      TableName: myTable,
      Key: { Pk: pk },
    });

    await db.send(command);

    return res.sendStatus(204);
  } catch (err) {
    console.error("Fel vid borttagning av användare:", err);
    return res.status(500).send({ error: "Något gick fel vid borttagning av användare." });
  }
});


export default router;
