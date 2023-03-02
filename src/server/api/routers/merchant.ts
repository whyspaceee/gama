import { businessRegisterProcedure } from "../procedures/merchants/businessRegisterProcedure";
import getCurrentMerchantProcedure from "../procedures/merchants/isVerifiedProcedure";
import personalRegisterProcedure from "../procedures/merchants/personalRegisterProcedure";

import { createTRPCRouter } from "../trpc";

export const merchantRouter = createTRPCRouter({
  registerBusiness: businessRegisterProcedure,

  registerPersonal: personalRegisterProcedure,

  getCurrentMerchant: getCurrentMerchantProcedure
});
