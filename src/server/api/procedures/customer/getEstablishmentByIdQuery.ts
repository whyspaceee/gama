import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const getEstablishmentByIdQuery = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    return ctx.prisma.establishment.findUnique({
      where: {
        id: input.id,
      },
      include: {
        menu: true,
        categories: true,
        address: true,
        openingHours: true,
        review: true,
      },
    });
  });
