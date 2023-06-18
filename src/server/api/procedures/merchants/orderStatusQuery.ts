import { TRPCError } from "@trpc/server";
import { merchantProcedure } from "../../trpc";

export const getCurrentOrders = merchantProcedure.query(async ({ ctx }) => {
  if (!ctx.session.user.merchantId)
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const merchant = await ctx.prisma.merchant.findUnique({
    where: {
      id: ctx.session.user.merchantId.toString(),
    },
    select: { 
      establishments: {
        select: {
          id: true,
        }
      }
    }
  }
  )

  if(!merchant?.establishments?.[0]?.id) throw new TRPCError({ code: "NOT_FOUND" });
  
  return ctx.prisma.order.findMany({
    where: {
      establishmentId: merchant?.establishments?.[0]?.id,
    },
    include: {
      customer: true,
      cart: {
        include: {
          orderItems: {
            include: {
              item: true,
            }
          }
        }       
      },
    }
  })

});

