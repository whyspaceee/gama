import { protectedProcedure } from "../../trpc";

export const getAllMerchantsProcedure = protectedProcedure.query(({ctx}) => {
    return ctx.prisma.merchant.findMany();
})