import { businessRegisterProcedure } from "../procedures/merchants/businessRegisterProcedure";
import getCurrentMerchantProcedure from "../procedures/merchants/getCurrentMerchantProcedure";
import personalRegisterProcedure from "../procedures/merchants/personalRegisterProcedure";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const merchantRouter = createTRPCRouter({
  registerBusiness: businessRegisterProcedure,

  registerPersonal: personalRegisterProcedure,

  getCurrentMerchant: getCurrentMerchantProcedure,
});


