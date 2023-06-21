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

    const establishmentLatLng = await ctx.prisma.establishment.findUnique({
      where: {
        id: input.establishmentId,
      },
      select: {
        address: true,
      },
    });

    if (!establishmentLatLng) {
      throw new TRPCError({
        message: "Establishment not found",
        code: "NOT_FOUND",
      });
    }

    const directions = await ctx.directions
      .getDirections({
        profile: "driving",
        geometries: "geojson",
        waypoints: [
          {
            coordinates: [
              establishmentLatLng.address?.longitude!,
              establishmentLatLng.address?.latitude!,
            ],
          },
          {
            coordinates: [input.lng, input.lat],
          },
        ],
      })
      .send();

    const distance = directions.body.routes[0]?.distance;

    if (!distance) {
      throw new TRPCError({ message: "Distance not found", code: "NOT_FOUND" });
    }

    const fare = Math.ceil(2000 + distance * 2);

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
        earning: fare,
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
      include: {
        cart: {
          include: {
            orderItems: {
              include: {
                item: true,
              },
            },
            promos: true,
          },
        },
        establishment: {
          include: {
            address: true,
          },
        },
      },
    });

    if (!order.cart)
      throw new TRPCError({ message: "Cart not found", code: "NOT_FOUND" });

    const price = order.cart.orderItems.reduce((acc, item) => {
      return acc + item.quantity * (item.item.price as unknown as number);
    }, 0);

    const afterDiscount = order.cart.promos[0]
      ? price - price * (order.cart.promos[0].amount as unknown as number)
      : price;

    const updatedOrder = await ctx.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        orderPrice: afterDiscount + order.earning,
      },
    });

    await ctx.prisma.wallet.update({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        balance: {
          decrement: afterDiscount + order.earning,
        },
      },
    });

    return updatedOrder;
  });
