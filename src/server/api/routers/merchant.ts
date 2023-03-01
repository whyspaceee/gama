import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const merchantRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        address: z.string(),
        number: z.string(),
        type: z.string(),
        companyData: z.optional(
          z.object({
            businessIdNumber: z.string(),
            companyEmail: z.string(),
            companyName: z.string(),
            officeAddress: z.string(),
            officeTelephone: z.string(),
          })
        ),
        personalData: z.optional(
          z.object({
            bankNumber: z.string(),
            nik: z.string(),
            taxId: z.string(),
          })
        ),
      })
    )
    .mutation(({ input, ctx }) => {
      if (input.companyData) {
        return ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            merchant: {
              create: {
                title: input.title,
                address: input.address,
                number: input.number,
                type: input.type,
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
      }
      if (input.personalData) {
        return ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            merchant: {
              create: {
                title: input.title,
                address: input.address,
                number: input.number,
                type: input.type,
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
      }
    }),
});
