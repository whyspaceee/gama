import { CreateBucketCommand, ListBucketsCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { businessRegisterProcedure } from "../procedures/merchants/businessRegisterProcedure";
import getCurrentMerchantProcedure from "../procedures/merchants/isVerifiedProcedure";
import personalRegisterProcedure from "../procedures/merchants/personalRegisterProcedure";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const merchantRouter = createTRPCRouter({
  registerBusiness: businessRegisterProcedure,

  registerPersonal: personalRegisterProcedure,

  getCurrentMerchant: getCurrentMerchantProcedure,

    
});


