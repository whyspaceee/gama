import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { env } from "../../../env.mjs";

export const geocodingRouter = createTRPCRouter({
  reverseGeocode: publicProcedure
    .input(z.object({ lat: z.number(), lng: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.geocoder
        .reverseGeocode({
          query: [input.lng, input.lat],
          types: ["place", "locality", "neighborhood", "address", "poi"],
          limit: 1,
        })
        .send()
        .then((response) => {
          const match = response.body;
          (match.features);
          return match.features;
        });
    }),

  forwardGeocode: publicProcedure
    .input(z.object({ address: z.string(), limit: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.geocoder
        .forwardGeocode({
          query: input.address,
          types: ["place", "locality", "neighborhood", "address", "poi"],
          limit: input.limit,
        })
        .send()
        .then((response) => {
          const match = response.body;
          (match.features);
          return match.features;
        });
    }),
});
