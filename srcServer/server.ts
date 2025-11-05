import express from 'express';
import cors from 'cors';
import type { checkLogin } from '../data/middleware.js'
import userRoute from './routes/Register.js'
import loginRoute from './routes/Login.js'
import channelRoute from './routes/Channels.js'
import messageRoute from './routes/Messages.js'


const app = express();
const port = Number(process.env.PORT) || 10000;


app.use(cors())
app.use(express.json()) 

app.use(express.static("./dist/"));

app.use('/api/users', userRoute)
app.use('/api/login', loginRoute)
app.use('/api/channels', channelRoute)
app.use('/api/messages', messageRoute)
app.use(checkLogin)





app.listen(port, () => {
  console.log(`Server listening on ...${port}`)
})