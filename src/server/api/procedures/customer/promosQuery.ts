import { z } from "zod";
import { prisma } from "../../../db";
import { protectedProcedure } from "../../trpc";

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
          },
        },
      },
    });

    if (!cart) {
      throw new Error(`Cart with ID ${input.cartId} not found`);
    }

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

