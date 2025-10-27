import express from 'express';
import dotenv from 'dotenv';
import db, { myTable } from '../data/dynamoDb.js'


dotenv.config();

const router = express.Router();

// Endpoint POST - registrera ny användare, hasha ett lösenord som sparas

router.post('/register', async (req, res) => {


    
})
    
export default router;
