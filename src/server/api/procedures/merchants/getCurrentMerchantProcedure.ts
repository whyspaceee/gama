import { merchantProcedure } from "../../trpc";

const getCurrentMerchantProcedure = merchantProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        merchant: {
          select: {
            type: true,
            isVerified: true,
            establishments: true,
          },
        }
      }
    });
  })

export default getCurrentMerchantProcedure