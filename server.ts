import express from 'express';
import connectToDatabase from './shared/connection/dbserver'; 
import cookieParser from 'cookie-parser';
import authRouter from './modules/auth/routes';
import spotifyRouter from './modules/spotify/routes';
import postRouter from './modules/post/routes';
import { authenticateJWT } from './shared/middleware/authenticateJWT';


const app = express();
const port = 3000;

connectToDatabase(); 

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/post', postRouter);

// Unsecured route for testing
app.get('/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

// Secure route for testing
app.get('/securehello', authenticateJWT, (req, res) => {
  res.json({ message: 'hello secure world' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
