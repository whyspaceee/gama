import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const driverRegisterProcedure = protectedProcedure
.input(
  z.object({
    title: z.string(),
    address: z.string(),
    number: z.string(),
    nik: z.string(),
    sim: z.string(),
    stnk: z.string(),
    vehicle: z.string(),
    bankNumber: z.string(),
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
        },
      },
    },
  });
})