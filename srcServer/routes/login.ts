import express from 'express';
import db, { myTable } from '../data/dynamoDb.js'
import { userPostSchema } from '../data/validation.js';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";


const router = express.Router();

router.post('/login', async (req, res) => {

    // TODO: Hämta email och lösenord
    // TODO: validera email och lösenord med zod (finns redan)

    const parsed = userPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).send({ error: "Ogitligt information" });
    }

    const { username, password } = parsed.data;

    // TODO: hämta användare från DB med hjälp av email


    // TODO: jämföra lösenord med bcrypt
    // TODO: skapa jwt token
    // TODO: skapa user id
    // TODO: skicka tillbaka succsess response
    // TODO: catch för att fånga fel


    
})
    
export default router;

