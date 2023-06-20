import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const finishOrderMutation = protectedProcedure
  .input(
    z.object({
      orderId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: {
        id: input.orderId,
      },
      select: {
        deliveryLat: true,
        deliveryLng: true,
        id: true,
        establishment: {
          select: {
            address: true,
            merchant: {
              select: {
                user: true,
              },
            },
          },
        },
        cart: {
          include: {
            promos: true,
            orderItems: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });

    if (!order || !order.cart) {
      throw new TRPCError({ message: "Order not found", code: "NOT_FOUND" });
    }

    const price = order.cart.orderItems.reduce((acc, item) => {
      return acc + item.quantity * (item.item.price as unknown as number);
    }, 0);

    const afterDiscount = order.cart.promos[0]
      ? price - price * (order.cart.promos[0].amount as unknown as number)
      : price;

    if (!order.establishment.merchant[0]?.user?.id) {
      throw new TRPCError({ message: "Merchant not found", code: "NOT_FOUND" });
    }

    await ctx.prisma.wallet.update({
      where: {
        userId: order.establishment.merchant[0]?.user.id,
      },
      data: {
        balance: {
          increment: afterDiscount,
        },
      },
    });

    const directions = await ctx.directions.getDirections({
        profile: "driving",
        geometries: "geojson",
        waypoints: [
            {
                coordinates: [order?.establishment?.address?.longitude!, order?.establishment?.address?.latitude!],

            },
            {
                coordinates: [order?.deliveryLng!, order?.deliveryLat!],
            }
            
        ]
    }).send();  
    
    const distance = directions.body.routes[0]?.distance;

    if(!distance) {
        throw new TRPCError({ message: "Distance not found", code: "NOT_FOUND" });
    }

    const fare = Math.ceil(2000 + distance * 2);

    const updatedDriverWallet = await ctx.prisma.wallet.update({
        where: {
            userId: ctx.session.user.id,
        },
        data: {
            balance: {
                increment: fare
            },
        },

    })

    const updatedStatus = await ctx.prisma.order.update({
        where: {
            id: input.orderId,
        },
        data: {
            status: "FINISHED",
        }
    })

    return updatedStatus


  });
