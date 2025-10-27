import express from 'express';
import dotenv from 'dotenv';
import db, { myTable } from '../data/dynamoDb.js'


dotenv.config();

const router = express.Router();

// Endpoint POST - Skicka direktmeddelande (DM)

router.post('/dm', async (req, res) => {


    
})
    
export default router;
