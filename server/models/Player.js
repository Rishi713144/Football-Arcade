import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  image: String,
  rarity: { type: String, enum: ['Common', 'Rare', 'Icon', 'Legend'], default: 'Common' },
  stats: {
    overall: Number,
    speed: Number,
    shooting: Number,
    dribbling: Number,
    physicality: Number,
    passing: Number,
    defending: Number,
    career: Number
  },
  alternatePositions: [String],
  nation: String,
  era: String,
  club: String
}, { timestamps: true });

export const Player = mongoose.model('Player', playerSchema);
