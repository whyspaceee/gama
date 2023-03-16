import { z } from "zod";
import { publicProcedure } from "../trpc";

export const startVerificationProcedure = publicProcedure
  .input(z.object({ phoneNumber: z.string() }))
  .mutation(({ input, ctx }) => {
    return ctx.everify.startVerification({
      phoneNumber: input.phoneNumber,
      method: "SMS",
    });
  });
