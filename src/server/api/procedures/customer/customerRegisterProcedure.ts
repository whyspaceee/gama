import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const customerRegisterProcedure = protectedProcedure
.input(
  z.object({
    name: z.string(),
    number: z.string(),
  })
)
.mutation(({ input, ctx }) => {
  return ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      customer: {
        create: {
          name: input.name,
          number: input.number,
        },
      },
    },
  });
})