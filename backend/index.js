import express from "express";

const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('Welcome to CamEra!');
});

app.listen(port, () => {
  console.log(`Backend listening on port http://localhost:${port}`);
});