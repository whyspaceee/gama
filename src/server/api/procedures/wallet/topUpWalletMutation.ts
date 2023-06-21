import { z } from "zod";
import { protectedProcedure } from "../../trpc";

const topUpWalletMutation = protectedProcedure
  .input(
    z.object({
      amount: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!ctx.session.user.id) {
      throw new Error("User not found");
    }
    return ctx.prisma.wallet.update({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        balance: {
          increment: input.amount,
        },
      },
    });
  });
