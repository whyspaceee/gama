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

  const dataWithPrice = data.map((order) => {
    if(!order.cart) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Order has no cart"
    });
    const totalPrice = order.cart.orderItems.reduce((acc, curr) => {
        return acc + (curr.item.price as unknown as number * curr.quantity);
    }, 0);
    return {
        ...order,
        totalPrice
    }
  })
  
  return dataWithPrice
  });
