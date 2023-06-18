import { z } from "zod";
import { merchantProcedure } from "../../trpc";
import { Status } from "@prisma/client";

export const orderStatusMutation = merchantProcedure.input(
    z.object({
        orderId: z.string(),
        status: z.nativeEnum(Status),
    })
).mutation(async ({ ctx, input }) => {
    return ctx.prisma.order.update({
        where: {
            id: input.orderId,
        },
        data: {
            status: input.status,
        }
    });
});