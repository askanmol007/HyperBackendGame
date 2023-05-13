const mongoose = require("mongoose");
const rewardListSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  walletAddress: {
    type: String,
    unique: true,
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
});
// Create a model for the GameStats collection
const RewardListData = mongoose.model("RewardListData", rewardListSchema);
module.exports = RewardListData;
