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
            establishments: {
              include: {
                orders:true,
                address: true,
                categories: true,
                review: true,
                openingHours: true,
                menu: {
                  include: {
                    category: true,
                  }
                }
              }
            },
          },
        }
      }
    });
  })

export default getCurrentMerchantProcedure