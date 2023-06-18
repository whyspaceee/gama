  
import Directions, { DirectionsService } from "@mapbox/mapbox-sdk/services/directions";
import { env } from "../env.mjs";
    
const globalForDirection = globalThis as unknown as { directions : DirectionsService };
    
    export const directions =
      globalForDirection.directions ||
      Directions({
        accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
      });
    
    if (env.NODE_ENV !== "production") globalForDirection.directions = directions;
    