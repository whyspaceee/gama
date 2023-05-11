import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const transferWalletMutation = protectedProcedure
  .input(
    z.object({
      amount: z.number(),
      to: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.wallet.update({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        balance: {
          decrement: input.amount,
        },
      },
    });

    await ctx.prisma.wallet.update({
      where: {
        id: input.to,
      },
      data: {
        balance: {
          increment: input.amount,
        },
      },
    });
  });


