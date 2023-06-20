import { AnimatePresence, motion } from "framer-motion";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BsWallet2, BsPeople } from "react-icons/bs";
import {
  IoFastFoodOutline,
  IoAnalyticsOutline,
  IoGitBranchOutline,
} from "react-icons/io5";
import {
  MdOutlineFeedback,
  MdOutlineHistory,
  MdOutlineSpeakerPhone,
} from "react-icons/md";
import { TbDiscount2 } from "react-icons/tb";
import { Map } from "react-map-gl";
import BottomBar from "../../components/merchant/BottomBar";
import WaitVerification from "../../components/driver/register/verification";
import IconButton from "../../components/merchant/IconButton";
import Spinner from "../../components/Spinner";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";
import DriverBottomBar from "../../components/driver/DriverBottomBar";
import WaitDriverVerification from "../../components/driver/register/verification";
import formatter from "../../utils/formatter";

import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "../../env.mjs";

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  session?.user;

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

export default function Driver() {
  const { data, isLoading } = api.driver.getCurrentDriver.useQuery();
  const [position, setPosition] = useState<GeolocationPosition>();

  const { data: wallet } = api.wallet.getWallet.useQuery();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition(position);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center ">
        <Spinner />
      </div>
    );
  }

  if (!data?.driver?.isVerified) {
    return <WaitDriverVerification />;
  }

  return (
    <>
      <motion.main
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className=" flex flex-col items-center gap-y-8 p-8 py-16"
      >
        <div className=" w-full font-semibold">
          <h1 className=" text-4xl font-bold">Gas! Driver</h1>
          <h2 className=" text-base font-bold text-gray-500">
            {data.driver.title}
          </h2>
        </div>
        <div className=" h-32 w-full rounded-lg bg-main bg-gradient-to-r p-4 font-semibold text-white shadow-xl transition-all active:-translate-y-2 ">
          <div className=" flex flex-row items-center gap-x-4">
            <BsWallet2 className=" h-9 w-9 " />
            <div>
              <h1>Balance</h1>
              <AnimatePresence>
                {wallet?.balance && (
                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="-mt-1 overflow-hidden text-clip text-lg font-bold "
                  >
                    {formatter.format(wallet?.balance)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          <h1 className=" w-full text-right">Today's revenue</h1>
          <p className=" w-full text-right">Rp 100.000</p>
        </div>
        <div className=" mb-8 w-full rounded-xl ">
          <div className=" overflow-hidden rounded-xl">
            <Map
              attributionControl={false}
              mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
              initialViewState={{
                longitude: 110.376352,
                latitude: -7.771081,
                zoom: 12,
              }}
              style={{
                position: "relative",
                width: "100%",
                height: "192px",
              }}
              longitude={position && position.coords.longitude}
              latitude={position && position.coords.latitude}
              mapStyle="mapbox://styles/mapbox/streets-v12"
            />
          </div>

          <div className=" mt-8 flex w-full flex-row flex-wrap justify-center gap-4">
            <IconButton
              href="/driver/history"
              Icon={MdOutlineHistory}
              label="History"
              delay={0}
            />
            <IconButton
              href="/driver/feedback"
              Icon={MdOutlineFeedback}
              label="Feedback"
              delay={0.1}
            />
            <IconButton
              href="/driver/analytics"
              Icon={IoAnalyticsOutline}
              label="Analytics"
              delay={0.2}
            />
          </div>
        </div>
      </motion.main>
      <DriverBottomBar />
    </>
  );
}
