import express from 'express';
import db, { myTable } from '../data/dynamoDb.js'



const router = express.Router();

// Endpoint POST - registrera ny användare, hasha ett lösenord som sparas

router.post('/register', async (req, res) => {


    
})
    
export default router;
