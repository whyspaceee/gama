import { protectedProcedure } from "../../trpc";

export const getCurrentDriverProcedure = protectedProcedure
.query(({ ctx }) => {
  return ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
    include: {
      driver: true,
    },
  });
}
)