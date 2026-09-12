import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Player } from './models/Player.js';
import { User } from './models/User.js';

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDist = path.join(projectRoot, 'client', 'dist');

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/api/players', async (_request, response) => {
  try {
    const players = await Player.find().sort({ name: 1 }).lean();
    response.json(players);
  } catch (error) {
    response.status(500).json({ message: 'Unable to load players.' });
  }
});

app.get('/api/profile/:id', async (request, response) => {
  try {
    const profile = await User.findById(request.params.id).populate('collection squad').lean();
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    response.json(profile);
  } catch (error) {
    response.status(400).json({ message: 'Invalid profile id.' });
  }
});

app.post('/api/profile', async (request, response) => {
  try {
    const profile = await User.create({ displayName: request.body.displayName || 'Rookie manager' });
    response.status(201).json(profile);
  } catch (error) {
    response.status(500).json({ message: 'Unable to create profile.' });
  }
});

app.patch('/api/profile/:id', async (request, response) => {
  try {
    const allowed = ['displayName', 'level', 'xp', 'packs', 'collection', 'squad', 'wins', 'losses', 'streak'];
    const updates = Object.fromEntries(Object.entries(request.body).filter(([key]) => allowed.includes(key)));
    const profile = await User.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true }).populate('collection squad');
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    response.json(profile);
  } catch (error) {
    response.status(400).json({ message: 'Unable to update profile.' });
  }
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
    }
  } else {
    console.warn('MONGODB_URI is not set; API is running without a database connection.');
  }

  app.get('*', (request, response) => {
    const indexFile = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexFile)) return response.sendFile(indexFile);
    response.status(404).send('Premier Legends build not found. Run `npm --prefix client run build`.');
  });

  app.listen(port, () => console.log(`API running at http://localhost:${port}`));
}

start();
