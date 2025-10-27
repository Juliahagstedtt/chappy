import express, { type Request, type Response, type Router } from 'express'
import dotenv from 'dotenv';
import { genSalt, hash } from "bcrypt";
import crypto from "crypto";
import db, { myTable } from '../data/dynamoDb.js'
import { userPostSchema } from '../data/validation.js'
import { email } from 'zod';


dotenv.config();

const router = express.Router();

// Endpoint POST - registrera ny användare, hasha ett lösenord som sparas

// Users me GET - Hämta info om inloggad användare

router.post('/register', async (req: Request, res: Response) => {

    const parsed = userPostSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).send({ error: "Ogitligt information" })
    }

    const { username, password } = parsed.data;

    // TODO: Skapa unikt ID

    const userId = crypto.randomUUID();
    console.log('Nytt användar Id', userId)
    
    // TODO: Hasha lösenordet med bcrypt
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    console.log('Hashat lösenord', hashedPassword)


    // TODO: Fixa objektet som ska sparas i DynamoDB
    const userItem = {
        PK: `USER#{userId}`,
        SK: `INFO`,
        name: username,
        email: username,
        password: hashedPassword,
        type: 'user',
    };

    console.log('User objekt redo att sparas', userItem)



    // TODO: Spara användaren i DynamoDB
    // TODO: Response till frontend 
    // TODO skapa JWT token senare

})
    

export default router;
