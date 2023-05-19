const dotenv = require("dotenv");
const s3 = require("@aws-sdk/client-s3");
const path = require("path");
dotenv.config();

const BUCKET_URI = `https://${process.env.BUCKET}.${process.env.BUCKET_ENDPOINT}`;
module.exports.bucketUri = BUCKET_URI;

// s3 client
const s3Client = new s3.S3Client({
  endpoint: `https://${process.env.BUCKET_ENDPOINT}`,
  forcePathStyle: false,
  region: "fra1",
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});
module.exports.upload = async (creatorAddress, file, key) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: key,
    Body: file.data,
    ACL: "public-read",
    Metadata: {
      creatorAddress: creatorAddress,
    },
  };
  try {
    console.log(`Syncing ${params.Key} ...`);
    const data = await s3Client.send(new s3.PutObjectCommand(params));
    console.log(`Successfully uploaded object: ${params.Key}`);
    return {
      cid: params.Key,
      data: data,
    };
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports.delete = async (key) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: key
  };
  try {
    const data = await s3Client.send(new s3.DeleteObjectCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
