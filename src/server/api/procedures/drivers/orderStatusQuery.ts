import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

export const driverOrderStatusQuery = protectedProcedure.query(
  async ({ ctx }) => {
    if (!ctx.session.user.driverId)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const data = await ctx.prisma.order.findMany({
      where: {
        OR: [
            {
                status: "ORDER_ACCEPTED",
            },
            {
                driverId: ctx.session.user.driverId.toString(),
            }
        ]
      },
      include: {
        customer: true,
        cart: {
          include: {
            orderItems: {
              include: {
                item: true,
              },
            },
          },
        },
        establishment: {
          include: {
            address: true,
          },
        },
      },
    });

    const dataWithPrice = data.map((order) => {
            return {
                ...order,
                totalPrice: order?.cart?.orderItems.reduce((acc, curr) => {
                    return acc + (curr?.item?.price as unknown as number) * curr.quantity;
                }
                , 0)
            }
        }
    )

    return dataWithPrice


  }
);
