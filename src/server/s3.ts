import { S3, S3Client } from "@aws-sdk/client-s3";

import { env } from "../env.mjs";

const globalForS3 = globalThis as unknown as { s3: S3 };

export const s3 =
    globalForS3.s3 ||
  new S3Client({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
      accessKeyId: env.SPACES_KEY,
      secretAccessKey:env.SPACES_SECRET
    }
  });

if (env.NODE_ENV !== "production") globalForS3.s3 = s3;
