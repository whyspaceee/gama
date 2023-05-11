import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";
import { api } from "../../utils/api";
import crypto from "crypto";
import formatter from "../../utils/formatter";
import Link from "next/link";


export default function WalletPage() {
  const router = useRouter();

  const { data: wallet } = api.wallet.getWallet.useQuery();

  return (
    <main className=" relative flex flex-col ">
      <div className=" h-25 flex w-full flex-col justify-between gap-1 bg-main px-6 py-4 text-white">
        <FaArrowLeft className="h-8" onClick={() => router.back()} />
        <h1 className=" text-3xl font-medium">Payment</h1>
      </div>
      <div className=" bg-neutral-100 py-6">
        <div className="relative mx-6 flex flex-col rounded-lg bg-main  bg-gradient-to-r px-6 py-6 text-white shadow-md ">
          <p className="  text-lg font-medium ">GaMaWallet</p>
          <AnimatePresence>
            {wallet && (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className=" text-2xl font-medium "
                >
                  {formatter.format(wallet?.balance)}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className=" text-sm font-medium "
                >
                  {wallet.id.slice(0,4)}-{wallet.id.slice(-4)}
                </motion.p>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="my-4 inline-flex gap-4 px-6">
        <button className=" inline-flex items-center gap-2 rounded-lg bg-white py-2 px-4 shadow-md">
          <FaCreditCard className=" text-main" />
          <p>Top up</p>
        </button>
        <Link href='/wallet/transfer' className=" inline-flex items-center gap-2 rounded-lg bg-white py-2 px-4 shadow-md">
          <FaCreditCard className=" text-main" />
          <p>Transfer</p>
        </Link>
      </div>
      <p className=" mx-6 text-lg font-bold">Recent transactions</p>
    </main>
  );
}
