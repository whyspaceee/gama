import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const acceptOrderMutation = protectedProcedure.input(
    z.object({
        orderId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        if (!ctx.session.user.driverId) {
            throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
        }

        return ctx.prisma.order.update({
            where: {
                id: input.orderId,
            },
            data: {
                status: "DRIVER_FOUND",
                driver: {
                    connect: {
                        id: ctx.session.user.driverId.toString(),
                    }
                }
            },
                
        })
    })