import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const orderFeeQuery = protectedProcedure.input(
    z.object({
        establishmentId: z.string(),
        lat: z.number(),
        lng: z.number(),
    })
).query(async ({ ctx, input }) => {
    const establishmentAddress = await ctx.prisma.establishment.findUnique({
        where: {
            id: input.establishmentId,
        },
        select: {
            address: true,
        },
    });

    if (!establishmentAddress) {
        throw new TRPCError({
            message: "Establishment not found",
            code: "NOT_FOUND",
        });

    }

    const directions = await ctx.directions
        .getDirections({
            profile: "driving",
            geometries: "geojson",
            waypoints: [
                {
                    coordinates: [
                        establishmentAddress.address?.longitude!,
                        establishmentAddress.address?.latitude!,
                    ],
                },
                {
                    coordinates: [input.lng, input.lat],
                },
            ],
        }).send();

    const distance = directions.body.routes[0]?.distance;

    if (!distance) {
        throw new TRPCError({ message: "Distance not found", code: "NOT_FOUND" });
    }

    const fare = Math.ceil(2000 + distance * 2);

    return fare;
})
