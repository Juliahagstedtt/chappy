import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import db, { myTable } from '../data/dynamoDb.js'
import { userPostSchema } from '../data/validation.js'
import { error } from 'console';


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


    
    // TODO: Hasha lösenordet med hjälp av bcrypt
    // TODO: Fixa objektet som ska sparas i DynamoDB
    // TODO: Spara användaren i DynamoDB
    // TODO: Response till frontend 
    // TODO skapa JWT token senare

})
    

export default router;
