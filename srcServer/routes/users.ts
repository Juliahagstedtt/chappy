import express from 'express';
import { genSalt, hash } from "bcrypt";
import crypto from "crypto";
import db, { myTable } from '../data/dynamoDb.js';
import { userPostSchema } from '../data/validation.js';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { createToken } from '../data/auth.js';

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
        res.status(200).send(result.Items);
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
        name: username,
        password: hashedPassword,
        type: 'user',
    };

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

export default router;
