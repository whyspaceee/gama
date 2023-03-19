import Geocoding, {
  GeocodeService,
} from "@mapbox/mapbox-sdk/services/geocoding";
import { PrismaClient } from "@prisma/client";

import { env } from "../env.mjs";

const globalForGeocoder = globalThis as unknown as { geocoder: GeocodeService };

export const geocoder =
  globalForGeocoder.geocoder ||
  Geocoding({
    accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
  });

if (env.NODE_ENV !== "production") globalForGeocoder.geocoder = geocoder;
