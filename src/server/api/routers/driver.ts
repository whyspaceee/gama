import { acceptOrderMutation } from "../procedures/drivers/acceptOrderMutation";
import { driverRegisterProcedure } from "../procedures/drivers/driverRegisterProcedure";
import { getCurrentDriverProcedure } from "../procedures/drivers/getCurrentDriverProcedure";
import { driverOrderDetailsQuery } from "../procedures/drivers/orderDetailsQuery";
import { driverOrderStatusQuery } from "../procedures/drivers/orderStatusQuery";
import { createTRPCRouter } from "../trpc";

export const driverRouter = createTRPCRouter({
  driverRegister: driverRegisterProcedure,

  getCurrentDriver: getCurrentDriverProcedure,

  orderStatusQuery: driverOrderStatusQuery,

  detailsQuery: driverOrderDetailsQuery,

  acceptOrder: acceptOrderMutation
});
