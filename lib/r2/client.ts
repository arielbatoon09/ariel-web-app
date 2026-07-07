import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error(
    "Cloudflare R2 credentials are not configured. Please set R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in your environment variables."
  );
}

export const r2Client = new S3Client({
  region: "auto", // R2 requires 'auto'
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});