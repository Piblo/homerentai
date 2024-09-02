import { S3Client } from "@aws-sdk/client-s3";

export const client = new S3Client({
  region: "eu-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY!,
  },
});

export const IMAGES_BUCKET_NAME = "homerentai-images";
