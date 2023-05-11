import { protectedProcedure } from "../../trpc";
import crypto from "crypto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const getWalletQuery = protectedProcedure.query(async ({ ctx }) => {
  const wallet = await ctx.prisma.wallet.findFirst({
    where: {
      userId: ctx.session.user.id,
    },
  });

  if (!wallet) {
    const data = (crypto.randomInt(1000000, 9999999) + Date.now())
      .toString()
      .slice(-8);

    return ctx.prisma.wallet.create({
      data: {
        id: data,
        balance: 0,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }

  return wallet;
});

export const getUserFromWalletIDQuery = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const data = await ctx.prisma.wallet.findUnique({
      where: {
        id: input.id,
      },
      select: {
        user: true,
      },
    });

    if(!data) throw new TRPCError({message:"User not found", code:"NOT_FOUND"});
    if(data.user.id === ctx.session.user.id) throw new TRPCError({message:"User not found", code:"NOT_FOUND"})

    return data;
  });