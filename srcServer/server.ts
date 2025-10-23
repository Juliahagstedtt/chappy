import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 10000;

app.use(cors());

app.use(express.static("./dist/"));

app.get('/', (req, res) => res.send('Chappy API online!'));


app.listen(port, () => {
  console.log(`Server listening on ...${port}`)
})