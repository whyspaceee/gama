import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { authOptions } from "../../server/auth";
import type { Session } from "next-auth";
import { api } from "../../utils/api";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Register from "./register";
import { BsWallet2 } from "react-icons/bs"
import IconButton from "../../components/merchant/IconButton";
import { MdRestaurantMenu } from "react-icons/md";
import {motion} from 'framer-motion'

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log(session?.user);

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/merchant/register",
        permanent: false,
      },
    };
  }

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
    <motion.main initial={{y:50}} animate={{y:0}} className=" flex flex-col p-8 items-center gap-y-8 py-16">
      <div className=" w-full font-semibold">
        <h1 className=" text-4xl">Gas! Madhang</h1>
        <h2 className=" text-lg">Nasi Goreng Padmanaba</h2>
      </div>
      <div className=" h-32 w-full bg-gradient-to-r from-[#5DE3D3] to-[#689BCA] text-white p-4 font-semibold shadow-lg rounded-lg ">
        <div className=" flex flex-row items-center gap-x-4">
          <BsWallet2  className=" w-9 h-9" />
          <div>
            <h1>Balance</h1>
            <p className="text-xl font-bold tracking-widest text-gray-50">Rp 100.000.000</p>
          </div>
        </div>
        <h1 className=" w-full text-right">Today's revenue</h1>
        <p className=" w-full text-right">Rp 100.000</p>
      </div>
      <div className=" w-full">
        <p className="font-medium text-lg w-full text-center mb-4">Customize your store</p>
        <div className=" w-full grid grid-cols-4 justify-center gap-4">
          <IconButton Icon={MdRestaurantMenu} label='Menu' delay={0}/>
          <IconButton Icon={MdRestaurantMenu} label='Promos' delay={0.2}/>
          <IconButton Icon={MdRestaurantMenu} label='Staff' delay={0.4}/>
          <IconButton Icon={MdRestaurantMenu} label='Analytics' delay={0.6}/>
          <IconButton Icon={MdRestaurantMenu} label='Branches' delay={0.8}/>

        </div>
      </div>
      
    </motion.main>
  );
}
