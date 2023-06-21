import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

export const customerOrderStatusQuery = protectedProcedure.query(async ({ ctx }) => {
  if (!ctx.session.user.customerId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  const data = await ctx.prisma.order.findMany({
    where: {
      customerId: ctx.session.user.customerId.toString(),
    },
    include: {
        establishment: {
            include: {
                address: true
            }
        },
        customer: true,
        cart: {
            include: {
                orderItems: {
                    include: {
                        item: true
                    }
                }
            }
        }
    }
  });

  return data;
  });
