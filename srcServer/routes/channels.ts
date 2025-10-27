import express from 'express';
import dotenv from 'dotenv';
import db, { myTable } from '../data/dynamoDb.js'


dotenv.config();

const router = express.Router();

// Endpoint GET - Hämta alla kanaler (öppna + låsta om auth)

// GET id - Hämta meddelanden i en kanal

// POST id - Skicka meddelande till kanal

router.post('/channel', async (req, res) => {


    
})
    
export default router;
