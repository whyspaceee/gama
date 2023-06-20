import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { BsWallet, BsWallet2, BsWalletFill } from "react-icons/bs";
import IconButton from "../../components/merchant/IconButton";
import { MdFeedback, MdOutlineFeedback, MdOutlineSpeaker, MdOutlineSpeakerGroup, MdOutlineSpeakerNotesOff, MdOutlineSpeakerPhone, MdOutlineThumbUpOffAlt, MdRestaurantMenu } from "react-icons/md";
import { motion } from "framer-motion";
import { TbDiscount2 } from "react-icons/tb";
import { BsPeople } from "react-icons/bs";
import {
  IoAnalyticsOutline,
  IoFastFoodOutline,
  IoGitBranch,
  IoGitBranchOutline,
} from "react-icons/io5";
import BottomBar from "../../components/merchant/BottomBar";
import { signOut, useSession } from "next-auth/react";
import { api } from "../../utils/api";
import Spinner from "../../components/Spinner";
import { FcAdvertising } from "react-icons/fc";
import { useEffect } from "react";
import WaitMerchantVerification from "../../components/merchant/register/WaitMerchantVerification";
import MerchantBottomBar from "../../components/merchant/BottomBar";
import formatter from "../../utils/formatter";
import Link from "next/link";

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  (session?.user);

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/merchant",
        permanent: false,
      },
    };
  }

  if (!session.user.merchantId) {
    return {
      redirect: {
        destination: "/merchant/register",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default function Merchant() {
  const { data: session } = useSession();

  const {data: balance} = api.wallet.getWallet.useQuery()
  const { data, isLoading } = api.merchant.getCurrentMerchant.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center ">
        <Spinner />
      </div>
    );
  }

  if (!data?.merchant?.isVerified) {
    return <WaitMerchantVerification />
  }

  return (
    <>
      <motion.main
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className=" flex flex-col items-center gap-y-8 p-8 py-16"
      >
        <div className=" w-full font-semibold">
          <h1 className=" text-4xl font-bold">Gas! Madhang</h1>
          <h2 className=" text-base font-bold">{data.merchant.establishments?.at(0)?.title}</h2>
        </div>
        <Link href={'/wallet'} className=" h-32 w-full rounded-lg bg-main bg-gradient-to-r p-4 font-semibold text-white shadow-xl transition-all active:-translate-y-2 ">
          <div className=" flex flex-row items-center gap-x-4">
            <BsWallet2 className=" h-9 w-9 " />
            <div>
              <h1>Balance</h1>
              <p className="-mt-1 overflow-hidden text-clip text-lg font-bold ">
                {formatter.format(balance?.balance || 0)}
              </p>
            </div>
          </div>
        </Link>
        <div className=" w-full">
          <p className="mb-4 w-full text-center text-lg font-medium">
            Customize your store
          </p>
          <div className=" grid w-full grid-cols-4 justify-center gap-4">
            <IconButton href='/merchant/menu' Icon={IoFastFoodOutline} label="Menu" delay={0} />
            <IconButton href='/merchant/promos' Icon={TbDiscount2} label="Promos" delay={0.2} />
            <IconButton href='/merchant/staff' Icon={BsPeople} label="Staff" delay={0.4} />
            <IconButton
              href='/merchant/analytics'
              Icon={IoAnalyticsOutline}
              label="Analytics"
              delay={0.6}
            />
            <IconButton
              href='/merchant/branches'
              Icon={IoGitBranchOutline}
              label="Branches"
              delay={0.8}
            />
            <IconButton
              href='/merchant/ads'
             Icon={MdOutlineFeedback} label="Feedback" delay={1} />
            <IconButton
              href='/merchant/ads'
             Icon={MdOutlineSpeakerPhone} label="Ads" delay={1.2} />
          </div>
        </div>
       
      </motion.main>
      <MerchantBottomBar />
    </>
  );
}
