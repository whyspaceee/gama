import { protectedProcedure } from "../../trpc";

export const getAllMerchantsProcedure = protectedProcedure.query(({ctx}) => {
    return ctx.prisma.merchant.findMany(
        {
            include: {
                establishments:{
                    include: {
                        menu: true,
                        orders: true,
                        categories: true,
                        review: true,
                        openingHours: true,
                        address: true,
                }
            }
        }}
    );
})