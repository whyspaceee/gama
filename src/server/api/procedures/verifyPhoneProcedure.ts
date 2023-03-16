import { z } from "zod";
import { publicProcedure } from "../trpc";

export const verifyPhoneProcedure = publicProcedure
.input(z.object({ phoneNumber: z.string(), code: z.string() }))
.mutation(({ input, ctx }) => {
  return ctx.everify.checkVerification({
    phoneNumber: input.phoneNumber,
    code: input.code,
  });
})