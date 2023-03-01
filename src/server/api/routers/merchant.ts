import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  merchantProcedure,
} from "../trpc";

export const merchantRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({ title: z.string(), address: z.string(), number: z.string() })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          merchant: {
            create: {
              ...input,
            },
          },
        },
      });
    }),
});
