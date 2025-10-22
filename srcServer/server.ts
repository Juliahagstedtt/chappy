import express from "express";

const app = express();
const port = 1337;

app.use(express.static("./dist/"));


app.listen(port, () => {
  console.log(`Server listening on ...${port}`)
})