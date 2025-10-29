import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/users.js'
import loginRoute from './routes/login.js'
import channelRoute from './routes/channels.js'
import messageRoute from './routes/messages.js'


dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 10000;


app.use(cors())
app.use(express.json()) 

app.use(express.static("./dist/"));

app.use('/api/users', userRoute)
app.use('/api/login', loginRoute)
app.use('/api/channels', channelRoute)
app.use('/api/messages', messageRoute)





app.listen(port, () => {
  console.log(`Server listening on ...${port}`)
})