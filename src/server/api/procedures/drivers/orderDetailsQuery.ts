import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const driverOrderDetailsQuery = protectedProcedure
  .input(
    z.object({
      orderId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    if (!ctx.session.user.driverId)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const currentOrder = await ctx.prisma.order.findFirst({
      where: {
        id: input.orderId,
      },
      include: {
        customer: true,
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
