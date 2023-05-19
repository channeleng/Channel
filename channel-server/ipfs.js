const axios = require("axios");
const dotenv = require("dotenv");
const FormData = require("form-data");
const ethers = require("ethers");
const pinataSDK = require('@pinata/sdk');
const { Readable } = require('node:stream');

dotenv.config();

const pinataApi = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
const pinataFileApi = "https://api.pinata.cloud/pinning/pinFileToIPFS";

module.exports.pinMedia = async (file) => {

  const filename = ethers.utils.id(file.name + file.md5);
  const formData = new FormData();
  formData.append("file", file.data, filename)

  return axios({
		method: "POST",
    url: pinataFileApi,
		maxContentLength: Infinity,
		headers: {
			pinata_api_key: process.env.PINATA_API,
			pinata_secret_api_key: process.env.PINATA_SECRET,
		},
		data: formData,
	});
};

module.exports.pin = (contentObj) => {
  var data = JSON.stringify({
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: "Channel Episode",
    },
    pinataContent: contentObj,
  });

  return axios({
    method: "post",
    url: pinataApi,
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: process.env.PINATA_API,
      pinata_secret_api_key: process.env.PINATA_SECRET,
    },
    data: data,
  });
};

module.exports.unPin = (ipfsCid) => {
  return axios({
    method: "delete",
    url: `https://api.pinata.cloud/pinning/unpin/${ipfsCid}`,
    headers: {
      pinata_api_key: process.env.PINATA_API,
      pinata_secret_api_key: process.env.PINATA_SECRET,
    },
  });
};
