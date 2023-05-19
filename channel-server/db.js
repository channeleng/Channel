const dotenv = require("dotenv");
dotenv.config();
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const db = new Sequelize(process.env.PG_CONNECTION_STR);

const objectSchema = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  value: {
    type: DataTypes.JSONB,
  },
};

const Profile = db.define("Profile", objectSchema);
const Episode = db.define("Episode", objectSchema);
const Link = db.define("Link", objectSchema);
const Contract = db.define("Contract", objectSchema);

// uncomment if schema changes
// db.sync({ force: true })

// generate random nonce
const genNonce = () => Math.floor(Math.random() * 1000000);

module.exports.getProfiles = (query = {}) => {
  const limit = query.limit ? query.limit : 10;
  const order = query.order ? query.order : "DESC";
  const where = {};
  if (query.address) where["value.address"] = query.address.toLowerCase();
  return Profile.findAll({
    where: where,
    order: [["createdAt", order]],
    limit: limit,
  });
};

module.exports.getProfile = (address) => {
  return Profile.findOne({ where: { "value.address": address.toLowerCase() } });
};

module.exports.getEpisodes = (query = {}) => {
  const where = {};
  const limit = query.limit && query.limit !='undefined' ? query.limit : undefined;
  const offset = query.offset &&  query.offset != 'NaN' ? query.offset : 0;
  const order = query.order ? query.order : "DESC";
  if (query.id) {
    where["id"] = query.id;
  }
  if (query.creatorAddress) {
    where["value.creatorAddress"] = query.creatorAddress.toLowerCase();
  }
  if (query.cid) {
    where["value.cid"] = query.cid;
  }
  return Episode.findAndCountAll({
    where: where,
    order: [["value.pubDate", order]],
    limit: limit,
    offset: offset,
  });
};

module.exports.getEpisodeCount = () => {
  return Episode.count();
};

module.exports.getLinks = (query = {}) => {
  const order = query.order ? query.order : "DESC";
  const where = {};
  if (query.subscriberAddress) {
    where["value.subscriberAddress"] = query.subscriberAddress.toLowerCase();
  }
  if (query.cid) {
    where["value.cid"] = query.cid;
  }
  return Link.findAll({
    where: where,
    order: [["createdAt", order]],
  });
};

module.exports.createLink = (link) => {
  return Link.create({ value: link });
};

module.exports.deleteLink = (id) => {
  return Link.destroy({ where: { id: id } });
};

module.exports.getContracts = (query = {}) => {
  const where = {};
  if (query.creatorAddress)
    where["value.creatorAddress"] = query.creatorAddress.toLowerCase();
  if (query.contractAddress)
    where["value.contractAddress"] = query.contractAddress.toLowerCase();
  return Contract.findAll({
    where: where,
    order: [["createdAt", "DESC"]],
  });
};

module.exports.updateProfile = async (newProfile) => {
  try {
    if (!newProfile.address) throw "No address";
    newProfile.nonce = genNonce();
    return await Profile.update(
      { value: newProfile },
      { where: { "value.address": newProfile.address.toLowerCase() } }
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports.createProfile = async (address) => {
  address = address.toLowerCase();
  // check if profile exists already
  console.log("check if profile exists already...", address);
  let profile = await Profile.findOne({
    where: { "value.address": address },
  });
  if (!profile) {
    return await Profile.create({
      value: {
        address: address,
        nonce: genNonce(),
      },
    });
  } else {
    return profile;
  }
};

module.exports.createEpisode = async (episode) => {
  return Episode.create({ value: episode });
};

module.exports.deleteEpisode = async (id) => {
  const episode = await Episode.findOne({ where: { id: id } });
  if (episode) {
    try {
      const imageCid = episode.value.imageCid;
      const mediaCid = episode.value.mediaCid;
      await episode.destroy();
      return {
        imageCid: imageCid,
        mediaCid: mediaCid,
      };
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("Nothing deleted");
  }
};

module.exports.db = db;
