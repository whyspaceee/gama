import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const businessRegisterProcedure = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      number: z.string(),
      type: z.string(),
      companyData: z.object({
        businessIdNumber: z.string(),
        companyEmail: z.string(),
        companyName: z.string(),
        officeAddress: z.string(),
        officeTelephone: z.string(),
      }),
      address: z.object({ label: z.string() , value: z.object({
        id: z.string(),
        type: z.string(),
        place_name: z.string(),
        center: z.array(z.number()),
        text: z.string(),
      }) })
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
            companyData: {
              create: {
                businessIdNumber: input.companyData.businessIdNumber,
                companyEmail: input.companyData.companyEmail,
                companyName: input.companyData.companyName,
                officeAddress: input.companyData.officeAddress,
                officeTelephone: input.companyData.officeTelephone,
              },
            },
          },
        },
      },
    });
  });

export default businessRegisterProcedure