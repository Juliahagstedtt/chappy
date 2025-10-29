import express from 'express';
import dotenv from 'dotenv';
import { genSalt, hash } from "bcrypt";
import crypto from "crypto";
import db, { myTable } from '../data/dynamoDb.js';
import { userPostSchema } from '../data/validation.js';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { createToken } from '../data/auth.js';
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    
    const parsed = userPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ error: "Ogitligt information" });
    }

    const { username, password } = parsed.data;
    
    // TODO: Skapa unikt ID
    const userId = crypto.randomUUID();
    // console.log('Nytt användar Id', userId);

    // TODO: Hasha lösenordet med bcrypt
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    // console.log('Hashat lösenord', hashedPassword);

    // TODO: Fixa objektet som ska sparas i DynamoDB
    const userItem = {
        Pk: `USER#${userId}`,
        Sk: `INFO`,
        name: username,
        // email,
        password: hashedPassword,
        type: 'user',
    };
    // console.log('User objekt redo att sparas', userItem);

    // TODO: Spara användaren i DynamoDB
    try {
        const command = new PutCommand({
            TableName: myTable,
            Item: userItem
        });

        await db.send(command);
        // console.log('Användare sparad i DynomoDB');

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
