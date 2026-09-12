import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  displayName: { type: String, default: 'Rookie manager' },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  packs: { type: Number, default: 1 },
  collection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  squad: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  streak: { type: Number, default: 0 }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
