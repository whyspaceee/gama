import { env } from "../env.mjs";
import Everify from "everify";

const globalForEverfy = globalThis as unknown as { everify: Everify };

export const everify =
  globalForEverfy.everify || new Everify(env.EVERIFY_KEY, { sandbox: true });

if (env.NODE_ENV !== "production") globalForEverfy.everify = everify;
