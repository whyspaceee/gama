import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const driverRouter = createTRPCRouter({
  startVerification: publicProcedure
    .input(z.object({ phoneNumber: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.everify.startVerification({
        phoneNumber: input.phoneNumber,
        method: "SMS",
      });
    }),

  verifyPhone: publicProcedure
    .input(z.object({ phoneNumber: z.string(), code: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.everify.checkVerification({
        phoneNumber: input.phoneNumber,
        code: input.code,
      });
    }),

  driverRegister: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        address: z.string(),
        number: z.string(),
        type: z.string(),
        nik: z.string(),
        sim: z.string(),
        stnk: z.string(),
        vehicle: z.string(),
        bankNumber: z.string(),
        isVerified: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          driver: {
            create: {
              title: input.title,
              number: input.number,
              address: input.address,
              nik: input.nik,
              sim: input.sim,
              stnk: input.stnk,
              vehicle: input.vehicle,
              bankNumber: input.bankNumber,
              isVerified: input.isVerified,
            },
          },
        },
      });
    }),
});
