import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { businessRegisterProcedure } from "../procedures/merchants/businessRegisterProcedure";
import getCurrentMerchantProcedure from "../procedures/merchants/getCurrentMerchantProcedure";
import personalRegisterProcedure from "../procedures/merchants/personalRegisterProcedure";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const merchantRouter = createTRPCRouter({
  registerBusiness: businessRegisterProcedure,

  registerPersonal: personalRegisterProcedure,

  getCurrentMerchant: getCurrentMerchantProcedure,

  getMenuPhotoPresignedUrl: protectedProcedure.mutation(({ ctx }) => {
    return getSignedUrl(ctx.s3, new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `menu/${crypto.randomUUID()}`,
      ContentType: "image/jpeg",
      Expires: new Date(Date.now() + 1000 * 60 * 5)
    }));
  })
});


