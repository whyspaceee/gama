import { driverRegisterProcedure } from "../procedures/drivers/driverRegisterProcedure";
import { getCurrentDriverProcedure } from "../procedures/drivers/getCurrentDriverProcedure";
import { createTRPCRouter } from "../trpc";

export const driverRouter = createTRPCRouter({
  driverRegister: driverRegisterProcedure,

  getCurrentDriver: getCurrentDriverProcedure
});
