  
  import Optimization, { OptimizationService } from "@mapbox/mapbox-sdk/services/optimization";
import { env } from "../env.mjs";
  
  const globalForOptimization = globalThis as unknown as { optimization : OptimizationService };
  
  export const optimization =
    globalForOptimization.optimization ||
    Optimization({
      accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
    });
  
  if (env.NODE_ENV !== "production") globalForOptimization.optimization = optimization;
  