import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const searchEstablishmentsAndMenusQuery = protectedProcedure
  .input(
    z.object({
      search: z.string(),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    })
  )
  .query(async ({ input, ctx }) => {
    const establishments = await ctx.prisma.establishment.findMany({
      where: {
        OR: [
          {
            title: {
              contains: input.search,
            },
          },
          {
            menu: {
              some: {
                title: {
                  contains: input.search,
                },
              },
            },
          },
        ],
      },
      include: {
        address: true,
        openingHours: true,
        review: true,
        menu: {
          where: {
            title: {
              contains: input.search,
            }
          }
        },
      },
    });

    console.log(establishments);

    const establishmentWithDistancesPromise = establishments.map(
      async (establishment) => {
        if (
          !establishment.address?.latitude ||
          !establishment.address?.longitude
        ) {
          return null;
        }
        const distance = await ctx.optimization
          .getOptimization({
            profile: "driving",
            waypoints: [
              {
                coordinates: [
                  establishment.address?.longitude,
                  establishment.address?.latitude,
                ],
              },
              {
                coordinates: [input.location.lng, input.location.lat],
              },
            ],
            source: "first",
            destination: "last",
            roundtrip: false,
          })
          .send()
          .then((response) => {
            return response.body.trips[0].distance;
          })
          .catch((error) => {
            error;
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          });
        return { ...establishment, distance };
      }
    );
    const establishmentWithDistances = await Promise.all(
      establishmentWithDistancesPromise
    );

    const sorted = establishmentWithDistances.sort((a, b) => {
      if (a?.distance && b?.distance) {
        return a.distance - b.distance;
      }
      return 0;
    });
    return sorted;
  });
