import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const personalRegisterProcedure = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      address: z.string(),
      number: z.string(),
      type: z.string(),
      personalData: z.object({
        bankNumber: z.string(),
        nik: z.string(),
        taxId: z.string(),
      }),
    })
  )
  .mutation(({ input, ctx }) => {
    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        merchant: {
          create: {
            type: input.type,
            establishments: {
              create: {
                title: input.title,
                address: input.address,
                number: input.number,
              },
            },
            personalData: {
              create: {
                bankNumber: input.personalData.bankNumber,
                nik: input.personalData.nik,
                taxId: input.personalData.taxId,
              },
            },
          },
        },
      },
    });
  });

  export default personalRegisterProcedure