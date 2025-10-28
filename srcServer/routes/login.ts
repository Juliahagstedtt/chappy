import express from 'express';
import dotenv from 'dotenv';
import db, { myTable } from '../data/dynamoDb.js'


dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {

    // TODO: Hämta email och lösenord

    
    // TODO: validera email och lösenord med zod (finns redan)
    // TODO: hämta användare från DB med hjälp av email
    // TODO: jämföra lösenord med bcrypt
    // TODO: skapa jwt token
    // TODO: skapa user id
    // TODO: skicka tillbaka succsess response
    // TODO: catch för att fånga fel


    
})
    
export default router;

