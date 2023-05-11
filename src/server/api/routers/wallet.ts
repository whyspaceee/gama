import { getUserFromWalletIDQuery, getWalletQuery } from "../procedures/wallet/getWalletQuery";
import {  transferWalletMutation } from "../procedures/wallet/transferWalletMutation";
import { createTRPCRouter } from "../trpc";

export const walletRouter = createTRPCRouter({
    getWallet: getWalletQuery,
    transferWallet: transferWalletMutation,
    getUserFromWalletId: getUserFromWalletIDQuery,

});
