import express from 'express';
import { Auth } from './routes/auth.route';
import { AppDataSource } from "./db/data-source"

AppDataSource.initialize().then(async () => {
  const app = express();
  const port = 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })

  app.get('/', (req, res) => {
    res.send('Hello World!');
  })

  app.use('/auth', Auth)

}).catch(error => console.log(error))
