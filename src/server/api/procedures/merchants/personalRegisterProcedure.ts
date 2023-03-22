import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const personalRegisterProcedure = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      address: z.object({ label: z.string() , value: z.object({
        id: z.string(),
        type: z.string(),
        place_name: z.string(),
        center: z.array(z.number()),
        text: z.string(),
      }) }),
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
                address: {
                  create: {
                    label: input.address.label!,
                    latitude: input.address.value.center[1]!,
                    longitude: input.address.value.center[0]!,
                    place_name: input.address.value.place_name!,
                    text: input.address.value.text!,
                    type: input.address.value.type!,
                  },
                },
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