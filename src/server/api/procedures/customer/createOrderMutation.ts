import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

//function to create new order
export const createOrderProcedure = protectedProcedure
  .input(
    z.object({
      establishmentId: z.string(),
      paymentType: z.enum(["CASH", "EWALLET"]),
      cartId: z.string(),
      lat: z.number(),
      lng: z.number(),
      address: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    if (!ctx.session.user.customerId) {
      throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
    }

    const order = await ctx.prisma.order.create({
      data: {
        deliveryAddress: input.address,
        deliveryLat: input.lat,
        deliveryLng: input.lng,
        establishment: {
          connect: {
            id: input.establishmentId,
          },
        },
        paymentType: input.paymentType,
        orderPrice: 0,
        cart: {
          connect: {
            id: input.cartId,
          },
        },

        customer: {
          connect: {
            id: ctx.session.user.customerId.toString(),
          },
        },
      },
    });

    const cart = await ctx.prisma.cart.findUnique({
      where: {
        id: input.cartId,
      },
      select: {
        promos: {
          select: {
            amount: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
            item: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    if (!cart)
      throw new TRPCError({ message: "Cart not found", code: "NOT_FOUND" });

    const price = cart.orderItems.reduce((acc, item) => {
      return acc + item.quantity * (item.item.price as unknown as number);
    }, 0);

    const afterDiscount = cart.promos[0]
      ? price - price * (cart.promos[0].amount as unknown as number)
      : price;

    const updatedOrder = await ctx.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        orderPrice: afterDiscount,
      },
    });

    return updatedOrder;
  });
