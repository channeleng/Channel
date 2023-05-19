const fs = require("node:fs");
const url = require("node:url");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 8081;
const ethers = require("ethers");
const podcast = require("podcast");
const xmlFormatter = require("xml");
const getMP3Duration = require("get-mp3-duration");
const packageJson = require("./package.json");
const signingMessages = require("./signingMessages.json");
const cookieParser = require("cookie-parser");
const CryptoJS = require("crypto-js");

const db = require("./db");
const storage = require("./storage");
const contractABI = require("./contract/contract-abi.json");
const podcastTemplate = require("./templates/podcast.json");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(fileUpload());
app.use(cookieParser());

// verify profile is in creator allow list
const verifyCreatorProfile = (address) => {
  const data = fs.readFileSync("./creatorAllowList.txt", "utf-8");
  const lines = data.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase() == address.toLowerCase()) {
      return true;
    }
  }
  return false;
};

// get token balance of address
const getBalance = async (address) => {
  try {
    ethers.utils.isAddress(address);
    const network = process.env.ETHEREUM_NETWORK;
    const provider = new ethers.providers.InfuraProvider(
      network,
      process.env.INFURA_API_KEY
    );
    const ChannelContract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI,
      provider
    );
    return await ChannelContract.balanceOf(address.toLowerCase());
  } catch (e) {
    console.log(e);
    return 0;
  }
};

// cors
app.use(
  cors({
    origin: [
      process.env.NODE_ENV == "development"
        ? "https://dev.example.com"
        : process.env.NODE_ENV == "staging"
        ? "https://stage.example.com"
        : "https://mmm.example.com",
      process.env.CLIENT_SERVER,
    ],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

// root
app.get("/", (req, res) => {
  res.json({
    name: packageJson.name,
    version: packageJson.version,
    env: process.env.NODE_ENV,
  });
});

// get episodes
app.get("/episodes/", async (req, res) => {
  try {
    const episodes = await db.getEpisodes(req.query);
    res.json(episodes);
  } catch (e) {
    console.log(e);
    res.json("Database Error");
  }
});

// create episode
app.post("/episodes/create/", async (req, res) => {
  req.socket.setTimeout(60 * 60 * 1000); // 60 minute timeout

  if (!req.body.creatorAddress || !verifyCreatorProfile(req.body.creatorAddress)) {
    res.json({ error: "permissions" });
    return;
  }

  const address = req.body.creatorAddress.toLowerCase();
  const episode = req.body;
  const signature = req.body.signature;
  const message = req.body.message;
  delete episode.signature;
  delete episode.message;
  const hash = ethers.utils.id(new Date().toString());
  episode.cid = hash;
  episode.creatorAddress = address;

  try {
    if (!signature) throw "No signature";

    var decryptedBytes = CryptoJS.AES.decrypt(message, process.env.AES_KEY);
    var decryptedMsg = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const verifiedAddress = ethers.utils.verifyMessage(decryptedMsg, signature);

    if (address !== verifiedAddress.toLowerCase()) throw "Invalid Signature";

    // upload media
    if (req.files.media) {
      console.log("upping media");
      const media = await storage.upload(
        address,
        req.files.media,
        `${address}/${hash}/media.mp3`
      );
      episode.duration = getMP3Duration(req.files.media.data);
      episode.mediaCid = media.cid;
      console.log("File stored", media.cid);
    }

    // upload image
    if (req.files.image) {
      console.log("upping image");
      const image = await storage.upload(
        address,
        req.files.image,
        `${address}/${hash}/image.png`
      );
      episode.imageCid = image.cid;
      console.log("Image stored", image.cid);
    }

    // add new ep to DB
    const newEpisode = await db.createEpisode(episode);
    res.json(newEpisode);
    return;
  } catch (e) {
    console.log(e);
    res.json({ error: "Error creating episode" });
    return;
  }
});

// delete episode
app.delete("/episodes/delete/", async (req, res) => {

  if (!req.body.creatorAddress || !verifyCreatorProfile(req.body.creatorAddress)) {
    res.json({ error: "permissions" });
    return;
  }

  const signature = req.body.signature;
  const message = req.body.message;
  const address = req.body.creatorAddress.toLowerCase();

  try {
    if (!signature) throw "No signature";

    var decryptedBytes = CryptoJS.AES.decrypt(message, process.env.AES_KEY);
    var decryptedMsg = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const verifiedAddress = ethers.utils.verifyMessage(decryptedMsg, signature);

    if (address !== verifiedAddress.toLowerCase()) throw "Invalid Signature";

    if (req.query.id) {
      // get episode to check ownership
      const existsAndOwned = await db.getEpisodes({
        id: req.query.id,
        creatorAddress: address,
      });
      if (existsAndOwned.count == 0)
        throw "Address does not have permissions to delete. (Doesn't own episode).";

      const deleted = await db.deleteEpisode(req.query.id);
      await storage.delete(deleted.imageCid);
      await storage.delete(deleted.mediaCid);
      res.json({ status: "deleted" });
    } else {
      res.json({ status: "Nothing deleted" });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: "Error Deleting Episode" });
  }
});

// get profiles
app.get("/profiles/", async (req, res) => {
  try {
    const profiles = await db.getProfiles(req.query);
    res.json(profiles);
  } catch (e) {
    console.log("error", e);
    res.json(e);
  }
});

// get/create profile
app.get("/profiles/:address", async (req, res) => {
  const address = req.params.address.toLowerCase();
  try {

    // check address validity
    ethers.utils.getAddress(address)

    const profile = await db.getProfile(address);
    if (profile) {
      res.json(profile);
      return;
    } else {
      const newProfile = await db.createProfile(address);
      res.json(newProfile);
      return;
    }
  } catch (e) {
    console.log("error", e);
    res.json(e);
  }
});

// create/update profile
app.post("/profiles/:address", async (req, res) => {
  const address = req.params.address.toLowerCase();
  let newProfile = req.body;
  const signature = req.body.signature;
  const message = req.body.message;
  let profile = {
    address: address,
  };

  try {
    if (!signature) throw "No signature";

    // check address validitiy
    ethers.utils.getAddress(address)

    // check for existing profile
    let existingProfile = await db.getProfile(address);

    if (!existingProfile) {
      // if profile doesn't exist, merge existing values and new values
      existingProfile = await db.createProfile(address);
    }

    if (existingProfile) {
      profile = { ...existingProfile.value, ...newProfile };
    }

    // verifies the profile address is lowercase
    profile.address = profile.address.toLowerCase();

    // remove extraneous metadata
    delete profile.signature;
    delete profile.message;

    var decryptedBytes = CryptoJS.AES.decrypt(message, process.env.AES_KEY);
    var decryptedMsg = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const verifiedAddress = ethers.utils.verifyMessage(decryptedMsg, signature);

    if (address !== verifiedAddress.toLowerCase()) throw "Invalid Signature";

    // upload image if it exists
    if (req.files && req.files.image) {
      const image = await storage.upload(
        address,
        req.files.image,
        address + "/profile.png"
      );
      profile.imageCid = image.cid;
      console.log("Profile image stored", image.cid);
    }

    // update profile
    const updated = await db.updateProfile(profile);
    if (updated) {
      const updatedProfile = await db.getProfile(address);
      res.json(updatedProfile);
      return;
    } else {
      res.json({ error: "Error updating profile" });
      return;
    }
  } catch (e) {
    res.json({ error: "Error updating profile"})
    console.error(e);
    return
  }
});

// verify profile
app.get("/profiles/:address/verify", async (req, res) => {
  const address = req.params.address.toLowerCase();
  try {
    // check address validity
    ethers.utils.getAddress(address)

    let profile = await db.getProfile(address);
    res.json({
      profile: profile ? profile.value : { address: address },
      isCreator: verifyCreatorProfile(address),
    });
  } catch (e) {
    console.log(e);
    res.json("verification error");
  }
});

// check contract for subscribers
app.get("/profiles/:address/balance", async (req, res) => {
  const address = req.params.address.toLowerCase();
  try {
    // check address validity
    ethers.utils.getAddress(address)

    const bal = await getBalance(address);
    res.json({
      balance: bal ? bal.toNumber() : 0,
    });
  } catch (e) {
    console.log(e);
    res.json("contract check error");
  }
});

app.post("/profiles/:address/preSign", async (req, res) => {
  const address = req.params.address.toLowerCase();

  // check address validity
  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    res.json({error: "invalid address"})
    return;
  };

  // get signing message
  const signingMessageKey = req.body.signingMessage;
  if (!signingMessageKey) {
    res.json({ error: "No Signing Message" });
    return;
  }
  const signingMessage = signingMessages[signingMessageKey];

  // get/create profile
  let profile, updatedProfile;
  try {
    profile = await db.getProfile(address);
    if (!profile) {
      profile = await db.createProfile(address);
    }
  } catch (e) {
    console.error(e);
    res.json({ error: "profile GET error" });
  }

  // update profile nonce
  try {
    updatedProfile = await db.updateProfile(profile.value);
    if (updatedProfile) {
      updatedProfile = await db.getProfile(profile.value.address);
    } else {
      throw "Error updating profile nonce";
    }
  } catch (e) {
    console.error(e);
    res.json({ error: "profile UDPDATE error" });
  }

  // replace placeholders in message string
  let msg = signingMessage.replace("{{nonce}}", updatedProfile.value.nonce);
  msg = msg.replace("{{address}}", updatedProfile.value.address);

  res.json({ signingMessage: msg });
  return;
});

// create link
app.post("/link/:address", async (req, res) => {
  const address = req.params.address.toLowerCase();
  const signature = req.body.signature;
  const message = req.body.message;

  try {
    if (!signature) throw "No signature";

    var decryptedBytes = CryptoJS.AES.decrypt(message, process.env.AES_KEY);
    var decryptedMsg = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const verifiedAddress = ethers.utils.verifyMessage(decryptedMsg, signature);

    if (address !== verifiedAddress.toLowerCase()) throw "Invalid Signature";

    const balance = await getBalance(address); // set balance to '1' for debug

    if (balance == 0) throw "No Balance";

    const linkObj = {
      cid: ethers.utils.id(new Date().toTimeString() + address),
      subscriberAddress: address,
    };

    const existingLinks = await db.getLinks({
      subscriberAddress: linkObj.subscriberAddress.toLowerCase(),
    });

    for (let i = 0; i < existingLinks.length; i++) {
      const link = existingLinks[i];
      await db.deleteLink(link.id);
    }

    const newLink = await db.createLink(linkObj);

    res.json(newLink.value);

    return;
  } catch (e) {
    console.error(e);
    res.json("Error creating link. No tokens or invalid signature.");
    return;
  }
});

// get rss
app.get("/rss/:linkCid", async (req, res) => {
  const linkCid = req.params.linkCid;

  res.set("Content-Type", "text/xml");

  if (!linkCid) {
    res.send(xmlFormatter({ error: "Invalid Link" }));
    return;
  }

  const links = await db.getLinks({ cid: linkCid });
  const subscriptionActive = links.length > 0;

  // if subscription doesn't exist, return error
  if (!subscriptionActive) {
    res.send(xmlFormatter({ error: "Invalid Subscription" }));
    return;
  }

  const episodeCount = await db.getEpisodeCount();
  const episodes = await db.getEpisodes({ limit: episodeCount });

  // add each episode to feed
  const feed = new podcast.Podcast(podcastTemplate);
  for (var i = 0; i < episodes.rows.length; i++) {
    const episode = episodes.rows[i];
    const { value } = episode.toJSON();
    const mediaUrl = new URL(value.mediaCid, storage.bucketUri).toString();
    const imageUrl = new URL(value.imageCid, storage.bucketUri).toString();
    const duration = Math.round(value.duration / 1000).toString();
    feed.addItem({
      title: value.title,
      author: value.author,
      itunesAuthor: value.author,
      itunesDuration: duration,
      imageUrl: imageUrl,
      description: value.description,
      itunesSummary: value.description,
      mediaUrl: mediaUrl,
      guid: mediaUrl,
      date: value.pubDate,
      enclosure: {
        type: "audio/mp3",
        url: mediaUrl,
        size: duration,
      },
    });
  }

  // return xml
  const xml = feed.buildXml();
  res.send(xml);
});



app.listen(PORT);
console.log("Local: http://localhost:" + PORT);
