import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import mongoose from 'mongoose';
import router from './src/routers/index';
import * as fileUpload from 'express-fileupload';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';

dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({}));
app.use('/api', router);

const start = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`server started on ${PORT} port`));
  } catch (error) {
    console.log(error);
  }
};

start();
