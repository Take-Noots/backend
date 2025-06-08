import express from 'express';
import connectToDatabase from './shared/connection/dbserver'; 
import cookieParser from 'cookie-parser';
import authRouter from './modules/auth/routes';


const app = express();
const port = 3000;

connectToDatabase(); 

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);

app.get('/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
