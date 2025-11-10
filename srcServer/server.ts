import express from 'express';
import cors from 'cors';
import userRoute from './routes/Register.js'
import loginRoute from './routes/login.js'
import channelRoute from './routes/Channel.js'
import dmRoute from './routes/dm.js'


const app = express();
const port = Number(process.env.PORT) || 10000;


app.use(cors())
app.use(express.json()) 

app.use(express.static("./dist/"));

app.use('/api/users', userRoute)
app.use('/api/login', loginRoute)
app.use('/api/channels', channelRoute)
app.use('/api/dm', dmRoute)



app.listen(port, () => {
  console.log(`Server listening on ...${port}`)
})