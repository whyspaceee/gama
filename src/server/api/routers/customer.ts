import { customerRegisterProcedure } from "../procedures/customer/customerRegisterProcedure";
import { getAllMerchantsProcedure } from "../procedures/customer/getAllMerchantsProcedure";
import { createTRPCRouter } from "../trpc";

export const customerRouter = createTRPCRouter({
    customerRegister : customerRegisterProcedure,
    getAllMerchants : getAllMerchantsProcedure,
})
