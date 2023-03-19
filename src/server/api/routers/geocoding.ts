import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import geocoding from '@mapbox/mapbox-sdk/services/geocoding'
import { env } from "../../../env.mjs";

export const geocodingRouter = createTRPCRouter({
    reverseGeocode: publicProcedure
        .input(z.object({ lat: z.number(), lng: z.number() }))
        .query(({ input, ctx }) => {
            const geocoder = geocoding({ accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN })
            return geocoder.reverseGeocode({
                query: [input.lng, input.lat],
                types: ['place', 'locality', 'neighborhood', 'address'],
                limit: 1
            }).send().then(response => {
                const match = response.body;
                console.log(match.features)
                return match.features[0]?.place_name
            }
            )
            
            
        }),
        
        
})
