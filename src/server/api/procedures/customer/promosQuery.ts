import { z } from "zod";
import { prisma } from "../../../db";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const getPromosFromEstablishment = protectedProcedure
  .input(
    z.object({
      establishmentId: z.string(),
    })
  )
  .query(({ ctx, input }) => {
    return ctx.prisma.promo.findMany({
      where: {
        establishmentId: input.establishmentId,
      },
    });
  });

export const updateCartPromos = protectedProcedure
  .input(
    z.object({
      cartId: z.string(),
      promoIds: z.array(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const cart = await ctx.prisma.cart.findUnique({
      where: {
        id: input.cartId,
      },
      select: {
        promos: {
          select: {
            id: true,
            minOrder: true
          },
        },
        orderItems: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!cart) {
      throw new Error(`Cart with ID ${input.cartId} not found`);
    }

    const cartPrice = cart.orderItems.reduce((acc, item) => {
      return acc + item.quantity * (item.item.price as unknown as number);
    }, 0);

    const promos = await ctx.prisma.promo.findMany({
      where: {
        id: {
          in: input.promoIds,
        },
      },
    })

    promos.forEach((promo) => {
      if (cartPrice < promo.minOrder) {
        throw new TRPCError({
          message: "Cart price is not satisfied",
          code: "NOT_FOUND",
        });
      }
    })
   

    const existingPromoIds = cart.promos.map((promo) => promo.id);
    const promoIdsToAdd = input.promoIds.filter(
      (id) => !existingPromoIds.includes(id)
    );
    const promoIdsToRemove = input.promoIds.filter((id) =>
      existingPromoIds.includes(id)
    );

    const updatePromos = async (promoIds: string[], connect: boolean) => {
      if (promoIds.length === 0) {
        return;
      }

      const data = connect
        ? {
            connect: promoIds.map((id) => ({ id })),
          }
        : {
            disconnect: promoIds.map((id) => ({ id })),
          };

      await ctx.prisma.cart.update({
        where: {
          id: input.cartId,
        },
        data: {
          promos: data,
        },
      });
    };

    await Promise.all([
      updatePromos(promoIdsToAdd, true),
      updatePromos(promoIdsToRemove, false),
    ]);

    return {
      success: true,
    };
  });
