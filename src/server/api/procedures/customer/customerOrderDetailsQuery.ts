import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const customerOrderDetailsQuery = protectedProcedure.input(
    z.object({
        orderId: z.string(),
    })
).query(async ({ ctx, input }) => {
    const currentOrder = await ctx.prisma.order.findUnique({
        where: {
            id: input.orderId,
        },
        include: {
            establishment: {
                include: {
                    address: true,
                }
            },
            cart: {
                include: {
                    orderItems: {
                        include: {
                            item: true,
                        },
                    },
                },
            },
            driver: true,
            
        },
    });
    const directions = await ctx.directions.getDirections({
        profile: "driving",
        geometries: "geojson",
        waypoints: [
            {
                coordinates: [currentOrder?.establishment?.address?.longitude!, currentOrder?.establishment?.address?.latitude!],

            },
            {
                coordinates: [currentOrder?.deliveryLng!, currentOrder?.deliveryLat!],
            }
            
        ]
    }).send();

    return {
        currentOrder,
        directions: directions.body ,
    }
});