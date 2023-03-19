import { driverRegisterProcedure } from "../procedures/drivers/driverRegisterProcedure";
import { getCurrentDriverProcedure } from "../procedures/drivers/getCurrentDriverProcedure";
import { startVerificationProcedure } from "../procedures/startVerificationProcedure";
import { verifyPhoneProcedure } from "../procedures/verifyPhoneProcedure";
import { createTRPCRouter } from "../trpc";

export const verificationRouter = createTRPCRouter({
    startVerification: startVerificationProcedure,
  
    verifyPhoneNumber: verifyPhoneProcedure,
  });