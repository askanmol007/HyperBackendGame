const PlayersData = require("./../models/PlayersDataModel");

function sameDay(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }

  d1 = new Date(d1);
  d2 = new Date(d2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Endpoint for saving wallet address
exports.SaveWalletAddress = async (req, res) => {
  try {
    const { userId, walletAddress } = req.body;
    const existingUser = await PlayersData.findOne({ userId });
    const existingWallet = await PlayersData.findOne({ walletAddress });
    if (existingUser || existingWallet) {
      res.status(202).json({
        message: "User/Wallet already exists",
        walletAddress: walletAddress,
      });
    } else {
      const newPlayersData = new PlayersData({
        userId,
        walletAddress,
        coinRewarded: false,
        numCoins: 0,
        matchCount: 0,
        matchesCompleted: false,
        todayPlayMinutes: 0,
        killCount: 0,
        headShotCount: 0,
        totalHeadshots: 0,
        todayDate: new Date(),
      });
      // console.log(newPlayersData);
      // Save the new game stats document to the database
      await newPlayersData.save();

      // Reward the player with 150 coins and set the coinRewarded flag to true on the server
      newPlayersData.numCoins += 150;
      newPlayersData.coinRewarded = true;
      await newPlayersData.save();
      res.status(200).json({
        message: "Wallet address saved successfully",
        numCoins: newPlayersData.numCoins,
        coinRewarded: newPlayersData.coinRewarded,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint for tracking Five Matches
// exports.TrackFiveMatches = async (req, res) => {
//   try {
//     const { userId, walletAddress } = req.body;
//     console.log(req.body);
//     // Validate that userId and walletAddress are both provided
//     if (!userId || !walletAddress) {
//       res.status(403).json({ message: "userId or walletAddress missing" });
//     }
//     // Find the existing game stats document for the user
//     const PlayersData = await PlayersData.findOne({ walletAddress });
//     console.log(PlayersData);

//     // If the user has no existing game stats document, return an error response
//     if (!PlayersData) {
//       res.status(404).json({ message: "Wallet not found" });
//     }
//     PlayersData.matchCount += 1;
//     await PlayersData.save();
//     if (PlayersData.matchCount >= 5 && !PlayersData.fiveMatchesCompleted) {
//       PlayersData.fiveMatchesCompleted = true;
//       PlayersData.numCoins += 200;
//       await PlayersData.save();
//       res.status(200).json({
//         message: "Five matches completed and rewarded with 200 coins",
//         numCoins: 200,
//         fiveMatchesCompleted: true,
//       });
//     }

//     // If neither condition is met, send a 403 error response
//     res.status(403).json({
//       message:
//         "Complete at least 5 matches or play for at least 60 minutes to receive rewards.",
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.TrackFiveMatches = async (req, res) => {
  try {
    const { userId, walletAddress } = req.body;
    console.log(req.body);
    // Validate that userId and walletAddress are both provided
    if (!userId || !walletAddress) {
      return res
        .status(403)
        .json({ message: "userId or walletAddress missing" });
    } else {
      // Find the existing game stats document for the user
      const data = await PlayersData.findOne({ walletAddress });
      console.log(data);

      // If the user has no existing game stats document, return an error response
      if (!data) {
        return res.status(404).json({ message: "Wallet not found" });
      } else {
        data.matchCount += 1;
        await data.save();
        if (data.matchCount >= 5) {
          data.fiveMatchesCompleted = true;
          data.numCoins += 200;
          await data.save();
          return res.status(200).json({
            message: "Five matches completed and rewarded with 200 coins",
            numCoins: 200,
            fiveMatchesCompleted: true,
          });
        } else {
          return res.status(403).json({
            message:
              "Complete at least 5 matches or play for at least 60 minutes to receive rewards.",
          });
        }
      }
    }

    // If neither condition is met, send a 403 error response
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.TrackSixtyMinutes = async (req, res) => {
  const { userId, walletAddress, playMinit: todayPlayMinutes } = req.body;
  // Validate that userId and walletAddress are both provided
  if (!userId || !walletAddress) {
    res.status(403).json({
      message: "userId or walletAddress missing",
    });
  }
  try {
    // Find the existing game stats document for the user
    const PlayersData = await PlayersData.findOne({ walletAddress });

    // If the user has no existing game stats document, return an error response
    if (!PlayersData) {
      res.status(404).json({ message: "Wallet not found" });
    }
    PlayersData.totalPlayMinutes += todayPlayMinutes;
    if (sameDay(new Date(PlayersData.todayDate), new Date())) {
      PlayersData.todayPlayMinutes += todayPlayMinutes;
    } else {
      PlayersData.todayPlayMinutes = todayPlayMinutes;
      PlayersData.todayDate = new Date();
    }
    await PlayersData.save();
    // If the player has played for 60 minutes today and hasnt been rewarded already,then reward them with 6 coins
    if (PlayersData.todayPlayMinutes >= 60) {
      // Check if the player has already been rewarded for today
      if (
        PlayersData.last60MinuteReward &&
        sameDay(PlayersData.last60MinuteReward, new Date())
      ) {
        // for the case where 60 minute reward has been given but 5 matches completed
        res.status(403).json({ message: "Already rewarded today" });
      }

      PlayersData.last60MinuteReward = new Date();
      PlayersData.numCoins += 6;
      PlayersData.sixtyMinitComplete = true;
      await PlayersData.save();

      res.status(200).json({
        message: "Played for 60 minutes and rewarded with 6 coins",
        numCoins: 6,
        sixtyMinitComplete: true,
      });
    }

    await PlayersData.save();
    // If neither condition is met, send a 403 error response
    res.status(403).json({
      message:
        "Complete at least 5 matches or play for at least 60 minutes to receive rewards.",
    });
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint for tracking Enemies Killing
exports.TrackHundredKills = async (req, res) => {
  const { userId, walletAddress, killCount } = req.body;

  if (!userId || !walletAddress) {
    res.status(403).json({ message: "userId or walletAddress missing" });
  }
  try {
    // Find the existing game stats document for the user
    const PlayersData = await PlayersData.findOne({ walletAddress });

    // If the user has no existing game stats document, return an error response
    if (!PlayersData) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    PlayersData.totalKills += killCount;
    // check if new days has started, if yes then reset the fields
    if (!sameDay(new Date(), PlayersData.todayDate2)) {
      console.log("same day", { killCount });
      PlayersData.todayDate2 = new Date();
      PlayersData.killCount = killCount;
    } else {
      console.log("not sameday", { killCount });
      PlayersData.killCount += killCount;
    }
    await PlayersData.save();
    console.log(PlayersData.killCount);
    // if user is not eligible for none of rewards,send 403
    if (PlayersData.killCount < 100) {
      res.status(403).json({
        message: "Less than 100 enemies killed!",
      });
    }
    if (sameDay(PlayersData.lastKillsRewardTime, new Date())) {
      res.status(403).json({
        message: "Already rewarded for today!",
      });
    }
    // if total kills for the day are 100+ and no reward was given today
    if (
      PlayersData.killCount >= 100 &&
      !sameDay(PlayersData.lastKillsRewardTime, new Date())
    ) {
      PlayersData.lastKillsRewardTime = new Date();
      await PlayersData.save();
      res.status(200).json({
        message: "Rewarded with 10 coins",
        numCoins: 10,
        killedHundred: true,
      });
    }
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.TrackTwentyFiveHeadShot = async (req, res) => {
  const { userId, walletAddress, headShotCount } = req.body;

  // Validate that userId and walletAddress are both provided
  if (!userId || !walletAddress) {
    return res.status(403).json({ message: "userId or walletAddress missing" });
  }
  try {
    // Find the existing game stats document for the user
    const PlayersData = await PlayersData.findOne({ walletAddress });

    // If the user has no existing game stats document, return an error response
    if (!PlayersData) {
      res.status(404).json({ message: "Wallet not found" });
    }
    PlayersData.totalHeadshots += headShotCount;
    // check if new days has started, if yes then reset the fields
    if (!sameDay(new Date(), PlayersData.todayDate3)) {
      (PlayersData.todayDate3 = new Date()),
        (PlayersData.headShotCount = headShotCount);
    } else {
      PlayersData.headShotCount += headShotCount;
    }
    await PlayersData.save();
    // if user is not eligible for none of rewards,send 403
    if (PlayersData.headShotCount < 25) {
      res.status(403).json({
        message: "Less than 25 headshots!",
      });
    }
    if (sameDay(PlayersData.lastHeadshotsRewardTime, new Date())) {
      res.status(403).json({
        message: "Already rewarded for today!",
      });
    }
    // if total kills for the day are 100+ and no reward was given today
    PlayersData.lastHeadshotsRewardTime = new Date();
    await PlayersData.save();
    res.status(200).json({
      message: "Rewarded with 5 coins",
      numCoins: 5,
      headShotKilled: true,
    });
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.RewardWinningPlayer = async (req, res) => {
  const { userId, walletAddress } = req.body;

  // Validate that userId and walletAddress are both provided
  if (!userId || !walletAddress) {
    res.status(403).json({ message: "userId or walletAddress missing" });
  }
  try {
    // Find the existing game stats document for the user
    const PlayersData = await PlayersData.findOne({ walletAddress });

    // If the user has no existing game stats document, return an error response
    if (!PlayersData) {
      res.status(404).json({ message: "Wallet not found" });
    }

    // If the player is on the winning team, reward them with 5 coins
    PlayersData.numCoins += 5;
    await PlayersData.save();
    // Send a success response
    res
      .status(200)
      .json({ message: "Rewarded with 5 coins for winning", numCoins: 5 });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.PlayerData = async (req, res) => {
  try {
    res.send(await PlayersData.find({}));
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.UpdateData = async (req, res) => {
  try {
    const data = await PlayersData.updateMany({
      todayDate: "2023-04-20T16:34:35.582Z",
      todayDate2: "2023-04-20T16:34:35.582Z",
      todayDate3: "2023-04-20T16:34:35.582Z",
      lastHeadshotsRewardTime: "2023-04-20T16:32:19.034Z",
      lastKillsRewardTime: "2023-04-20T16:34:36.150Z",
      last60MinuteReward: "2023-04-20T16:33:40.887Z",
    });
    res.status(200).json({
      message: "Data Updated sucessfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.DeleteAllPlayer = async (req, res) => {
  try {
    res.send(await PlayersData.deleteMany({}));
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
