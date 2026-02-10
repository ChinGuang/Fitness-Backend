import 'dotenv/config';
import express from 'express';
import { AuthRouter } from './routes/auth.route';
import { AppDataSource } from "./db/data-source"
import { MemberRouter } from './routes/member.route';
import cookieParser from 'cookie-parser';

AppDataSource.initialize().then(async () => {
  const app = express();
  const port = 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })

  app.get('/', (req, res) => {
    res.send('Hello World!');
  })
  app.use(express.json());
  app.use(cookieParser());

  app.use('/auth', AuthRouter)
  app.use('/members', MemberRouter)

}).catch(error => console.log(error))
