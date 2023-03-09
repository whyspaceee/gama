import { motion } from "framer-motion";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { BsWallet2, BsPeople } from "react-icons/bs";
import { IoFastFoodOutline, IoAnalyticsOutline, IoGitBranchOutline } from "react-icons/io5";
import { MdOutlineFeedback, MdOutlineSpeakerPhone } from "react-icons/md";
import { TbDiscount2 } from "react-icons/tb";
import BottomBar from "../../components/BottomBar";
import IconButton from "../../components/merchant/IconButton";
import Spinner from "../../components/Spinner";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";

export async function getServerSideProps(context: { req: any; res: any }) {
    const session = await getServerSession(context.req, context.res, authOptions);
  
    console.log(session?.user);
  
    if (!session) {
      return {
        redirect: {
          destination: "/login?callbackUrl=/driver",
          permanent: false,
        },
      };
    }
  
    if (!session.user.driverId) {
      return {
        redirect: {
          destination: "/driver/register",
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
  
    const { data, isLoading } = api.merchant.getCurrentMerchant.useQuery();
  
    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center ">
          <Spinner />
        </div>
      );
    }
  
    if (!data?.merchant?.isVerified) {
      return <div>Not Verified</div>;
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
            <h2 className=" text-base font-bold">{data.merchant.title}</h2>
          </div>
          <div className=" h-32 w-full rounded-lg bg-main bg-gradient-to-r p-4 font-semibold text-white shadow-xl transition-all active:-translate-y-2 ">
            <div className=" flex flex-row items-center gap-x-4">
              <BsWallet2 className=" h-9 w-9 " />
              <div>
                <h1>Balance</h1>
                <p className="-mt-1 overflow-hidden text-clip text-lg font-bold ">
                  Rp 100.000.000
                </p>
              </div>
            </div>
            <h1 className=" w-full text-right">Today's revenue</h1>
            <p className=" w-full text-right">Rp 100.000</p>
          </div>
          <div className=" w-full">
            <p className="mb-4 w-full text-center text-lg font-medium">
              Customize your store
            </p>
            <div className=" grid w-full grid-cols-4 justify-center gap-4">
              <IconButton Icon={IoFastFoodOutline} label="Menu" delay={0} />
              <IconButton Icon={TbDiscount2} label="Promos" delay={0.2} />
              <IconButton Icon={BsPeople} label="Staff" delay={0.4} />
              <IconButton
                Icon={IoAnalyticsOutline}
                label="Analytics"
                delay={0.6}
              />
              <IconButton
                Icon={IoGitBranchOutline}
                label="Branches"
                delay={0.8}
              />
              <IconButton Icon={MdOutlineFeedback} label="Feedback" delay={1} />
              <IconButton Icon={MdOutlineSpeakerPhone} label="Ads" delay={1.2} />
            </div>
          </div>
         
        </motion.main>
        <BottomBar />
      </>
    );
  }