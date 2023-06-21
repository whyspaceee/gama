import { getUserFromWalletIDQuery, getWalletQuery } from "../procedures/wallet/getWalletQuery";
import {  topupWalletMutation, transferWalletMutation } from "../procedures/wallet/transferWalletMutation";
import { createTRPCRouter } from "../trpc";

export const walletRouter = createTRPCRouter({
    getWallet: getWalletQuery,
    transferWallet: transferWalletMutation,
    getUserFromWalletId: getUserFromWalletIDQuery,
    topUp: topupWalletMutation

});
