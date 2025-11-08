import express from 'express';
import db, { myTable } from '../data/dynamoDb.js'


const router = express.Router();

// api/messages/dm/:otherUserId
router.get('/', async (req, res) => {
    
})



// Endpoint POST - Skicka direktmeddelande (DM)
router.post('/dm', async (req, res) => {


    
})
    
export default router;
