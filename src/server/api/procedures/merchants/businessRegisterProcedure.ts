import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const businessRegisterProcedure = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      address: z.string(),
      number: z.string(),
      type: z.string(),
      companyData: z.object({
        businessIdNumber: z.string(),
        companyEmail: z.string(),
        companyName: z.string(),
        officeAddress: z.string(),
        officeTelephone: z.string(),
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