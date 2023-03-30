import Matrix, { MatrixService } from "@mapbox/mapbox-sdk/services/matrix";
  
  import { env } from "../env.mjs";
  
  const globalForMatrix = globalThis as unknown as { matrix: MatrixService };
  
  export const matrix =
    globalForMatrix.matrix ||
    Matrix({
      accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
    });
  
  if (env.NODE_ENV !== "production") globalForMatrix.matrix = matrix;
  