const express = require("express");
const playerController = require("./../controller/playerController");

const router = express.Router();

//ROTER FOR SAVE WALLET ADDRESS AS WELL AS CREATE IF NOT GETTING
router.route("/saveWalletAddress").post(playerController.SaveWalletAddress);

//ROUTER FOR TRACK FIVE MATCHES
router.route("/trackFiveMatches").post(playerController.TrackFiveMatches);

//ROUTER FOR TRACK SIXTY MINUTES
router.route("/trackSixtyMinutes").post(playerController.TrackSixtyMinutes);

//ROUTER FOR TRACK HUNDRED KILLS
router.route("/trackHundredKills").post(playerController.TrackHundredKills);

//ROUTER FOR TRACK TWENTY FIVE HEAD SHOTS
router
  .route("/trackTwentyFiveHeadshots")
  .post(playerController.TrackTwentyFiveHeadShot);

//ROUTER FOR TRACK REWARD WINNING PLAYER
router
  .route("/rewardWinningPlayers")
  .post(playerController.RewardWinningPlayer);

//ROUTER FOR GETTING ALL PLAYER DATA
router.route("/PlayerData").get(playerController.PlayerData);

//ROUTER FOR UPDATE PLAYER DATA
router.route("/UpdateData").get(playerController.UpdateData);

//ROUTER TO DELETE ALL PLAYER DATA
router.route("/DeleteAllPlayer").delete(playerController.DeleteAllPlayer);

module.exports = router;
