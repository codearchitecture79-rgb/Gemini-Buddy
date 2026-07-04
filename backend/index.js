import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/users.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import cors from 'cors'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
  try {
    res.status(200).json({
    aciveStatus: true
  })
  } catch (error) {
    console.log(error);
    res.status(500).json({
    message: 'Internal server error'
  })
  }
})

app.use('/', userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});