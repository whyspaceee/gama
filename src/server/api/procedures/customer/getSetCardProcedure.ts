import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const getEstablishmentCartQuery = protectedProcedure
  .input(
    z.object({
      establishmentId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    if (ctx.session.user.customerId === null)
      throw new TRPCError({
        message: "User is not a customer",
        code: "INTERNAL_SERVER_ERROR",
      });
    const cart = await ctx.prisma.cart.findFirst({
      where: {
        customerId: ctx.session.user.customerId!.toString(),
        establishmentId: input.establishmentId,
      },
      include: {
        orderItems: {
          include: {
            item: true,
          },
        },
        promos: true
      },
    });
    if (cart) {
      return cart;
    } else {
      return ctx.prisma.cart.create({
        data: {
          customerId: ctx.session.user.customerId!.toString(),
          establishmentId: input.establishmentId,
        },
        include: {
          orderItems: {
            include: {
              item: true,
            },
          },
          promos: true
        },
      });
    }
  });

export const updateEstablishmentCartMutation = protectedProcedure
  .input(
    z.object({
      establishmentId: z.string(),
      cartId: z.string(),
      orderItems: z.array(
        z.object({
          itemId: z.string(),
          quantity: z.number(),
        })
      ),
    })
  )
  .mutation(({ ctx, input }) => {
    if (ctx.session.user.customerId === null)
      throw new TRPCError({
        message: "User is not a customer",
        code: "INTERNAL_SERVER_ERROR",
      });

   

    return ctx.prisma.cart.upsert({
      where: {
        id: input.cartId,
      },
      create: {
        customerId: ctx.session.user.customerId!.toString(),
        establishmentId: input.establishmentId,
        orderItems: {
          create: input.orderItems.map((orderItem) => ({
            item: {
              connect: {
                id: orderItem.itemId,
              },
            },
            quantity: orderItem.quantity,
          })),
        },
      },
      update: {
        orderItems: {
          deleteMany: {
            itemId: {
              in: input.orderItems.map((orderItem) => orderItem.itemId),
            },
          },
          create: input.orderItems
            .filter((orderItem) => orderItem.quantity !== 0)
            .map((orderItem) => ({
              quantity: orderItem.quantity,
              item: {
                connect: {
                  id: orderItem.itemId,
                },
              },
            })),
        },
      },
    });
  });
