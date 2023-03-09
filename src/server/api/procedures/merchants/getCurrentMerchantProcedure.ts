import { merchantProcedure } from "../../trpc";

const getCurrentMerchantProcedure = merchantProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        merchant: true
      }
    });
  })

export default getCurrentMerchantProcedure