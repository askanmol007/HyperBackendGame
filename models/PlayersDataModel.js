const mongoose = require("mongoose");
const gameStatsSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  walletAddress: {
    type: String,
    unique: true,
  },
  coinRewarded: {
    type: Boolean,
    default: false,
  },

  numCoins: {
    type: Number,
    default: 0,
  },
  matchCount: {
    type: Number,
    default: 0,
  },
  matchesCompleted: {
    type: Boolean,
    default: false,
  },
  todayPlayMinutes: {
    type: Number,
    default: 0,
  },
  totalPlayMinutes: {
    type: Number,
    default: 0,
  },
  totalKills: {
    type: Number,
    default: 0,
  },
  totalHeadshots: {
    type: Number,
    default: 0,
  },
  killCount: {
    type: Number,
    default: 0,
  },
  headShotCount: { type: Number, default: 0 },
  fiveMatchesCompleted: Boolean,
  sixtyMinitComplete: Boolean,
  isWinner: Boolean,
  lastKillsRewardTime: Date,
  lastHeadshotsRewardTime: Date,
  last60MinuteReward: Date,
  todayDate: { type: Date, default: new Date() },
  todayDate2: {
    type: Date,
    default: new Date(),
  },
  todayDate3: {
    type: Date,
    default: new Date(),
  },
  headshotClaimStatus: {
    type: Boolean,
    default: false,
  },
  totalKillClaimStatus: {
    type: Boolean,
    default: false,
  },
  totalTimeClaimStatus: {
    type: Boolean,
    default: false,
  },
  rewardDate: {
    type: Date,
    default: new Date(),
  },
});
// Create a model for the GameStats collection
const PlayersData = mongoose.model("PlayersData", gameStatsSchema);
module.exports = PlayersData;
