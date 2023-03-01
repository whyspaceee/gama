import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { merchantRouter } from "./routers/merchant";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  merchant: merchantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
