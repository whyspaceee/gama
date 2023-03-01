import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { BsWallet2 } from "react-icons/bs";
import IconButton from "../../components/merchant/IconButton";
import { MdRestaurantMenu } from "react-icons/md";
import { motion } from "framer-motion";
import { CiDiscount1 } from "react-icons/ci";
import { BsPeople } from "react-icons/bs"
import { IoAnalyticsOutline, IoFastFoodOutline, IoGitBranch, IoGitBranchOutline } from "react-icons/io5"

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log(session?.user);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/login?callbackUrl=/merchant",
  //       permanent: false,
  //     },
  //   };
  // }

  // if (!session.user.merchantId) {
  //   return {
  //     redirect: {
  //       destination: "/merchant/register",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      session,
    },
  };
}

export default function Merchant() {
  return (
    <motion.main
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      className=" flex flex-col items-center gap-y-8 p-8 py-16"
    >
      <div className=" w-full font-semibold">
        <h1 className=" text-4xl">Gas! Madhang</h1>
        <h2 className=" text-lg">Nasi Goreng Padmanaba</h2>
      </div>
      <div className=" h-32 w-full rounded-lg bg-black bg-gradient-to-r p-4 font-semibold text-white shadow-lg ">
        <div className=" flex flex-row items-center gap-x-4">
          <BsWallet2 className=" h-9 w-9" />
          <div>
            <h1>Balance</h1>
            <p className="-mt-1 text-lg font-bold ">Rp 100.000.000</p>
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
          <IconButton Icon={CiDiscount1} label="Promos" delay={0.2} />
          <IconButton Icon={BsPeople} label="Staff" delay={0.4} />
          <IconButton Icon={IoAnalyticsOutline} label="Analytics" delay={0.6} />
          <IconButton Icon={IoGitBranchOutline} label="Branches" delay={0.8} />
        </div>
      </div>
    </motion.main>
  );
}
