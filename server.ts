import express from 'express';
import connectToDatabase from './shared/connection/dbserver'; 
import cookieParser from 'cookie-parser';
import authRouter from './modules/users/routes';
import spotifyRouter from './modules/spotify/routes';
import postRouter from './modules/content/routes';
import { authenticateJWT } from './shared/middleware/authenticateJWT';
import cors from 'cors';
import { SearchTracks } from './modules/spotify/controllers/searchController';


const app = express();
const port = 3000;

connectToDatabase(); 

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/post', postRouter);

// Allow all origins (for development)
app.use(cors());

// Or, to allow only your frontend origin:
// app.use(cors({ origin: 'http://localhost:49402' }));

// Unsecured route for testing
app.get('/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

// Secure route for testing
app.get('/securehello', authenticateJWT, (req, res) => {
  res.json({ message: 'hello secure world' });
});

// Register the route
app.post('/api/spotify/search', SearchTracks);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
