import { motion } from "framer-motion";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import {
  BsWallet2,
  BsPeople,
  BsPlus,
  BsPin,
  BsPinMap,
  BsSearch,
} from "react-icons/bs";
import {
  IoFastFoodOutline,
  IoAnalyticsOutline,
  IoGitBranchOutline,
} from "react-icons/io5";
import { MdOutlineFeedback, MdOutlineHistory } from "react-icons/md";
import WaitVerification from "../../components/driver/register/verification";
import IconButton from "../../components/merchant/IconButton";
import Spinner from "../../components/Spinner";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";
import CustomerBottomBar from "../../components/customer/CustomerBottomBar";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

export default function Customer() {
  const { data, isLoading } = api.driver.getCurrentDriver.useQuery();
  const [position, setPosition] = useState<GeolocationPosition>();

  const { data: merchants, isLoading: isLoadingMerchants } =
    api.customer.getAllMerchants.useQuery();

  const { data: location, isLoading: isLoadingLocation } = api.geocoding.reverseGeocode.useQuery({
    lat: position?.coords.latitude!,
    lng: position?.coords.longitude!
    }, {
        enabled: !!position
    });

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
    return <WaitVerification />;
  }

  return (
    <>
      <motion.main
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className=" flex flex-col items-center gap-y-8 p-8 py-16"
      >
        <div className="absolute top-0 h-36 w-full bg-main py-6 px-8 font-semibold">
          <div className=" flex h-full flex-col justify-between">
            <div>
              <div className=" flex flex-row items-center gap-2">
                <FaMapMarkerAlt className=" fill-white" />
                <p className=" font-medium text-white">Your location</p>
              </div>
              <p className=" text-lg font-bold text-white overflow-hidden h-8">
                {isLoadingLocation ? "Loading..." : location?.[0]?.address || ' ' }
              </p>
            </div>
            <div>
              <BsSearch className=" absolute top-24 left-12" />
              <input
                placeholder="Madhang apa hari ini ?"
                className=" w-full rounded-full px-12 py-1"
              />
            </div>
          </div>
        </div>
        <div className=" mt-28 w-full rounded-lg bg-main bg-gradient-to-r p-4 font-semibold text-white shadow-xl transition-all active:-translate-y-2 ">
          <div className=" flex flex-row items-center justify-between gap-x-4">
            <div className=" flex flex-row items-center gap-4">
              <BsWallet2 className=" h-9 w-9 " />
              <div>
                <h1>Balance</h1>
                <p className="-mt-1 overflow-hidden text-clip text-lg font-bold ">
                  Rp 100.000.000
                </p>
              </div>
            </div>
            <div>
              <BsPlus className=" h-10 w-10 rounded-xl bg-white fill-main" />
            </div>
          </div>
        </div>
        <div className=" flex w-full flex-col gap-2">
          <p className=" w-full text-left text-xl font-bold">Near you</p>
          <div className=" relative h-40 w-full rounded-xl overflow-hidden ">
            {!isLoadingMerchants && (
              <Swiper
                slidesPerView={1}
                spaceBetween={32}
                direction="horizontal"
                className=" h-full w-full"
              >
                {merchants?.map((merchant) => (
                  <SwiperSlide>
                    <Image
                      fill
                      alt="food"
                      src="https://source.unsplash.com/random?food"
                      className=" rounded-xl object-cover"
                    />
                    <div className="absolute bottom-0 flex h-12 w-full flex-col justify-center rounded-b-xl bg-main ">
                      <p className=" p-4 text-lg font-bold text-white">
                        {merchant.establishments?.[0]?.title}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
        <div className=" mb-8 w-full rounded-xl ">
          <div className=" flex w-full flex-row flex-wrap justify-center gap-4">
            <IconButton Icon={MdOutlineHistory} label="Near you" delay={0} />
            <IconButton Icon={MdOutlineFeedback} label="Promo" delay={0.1} />
            <IconButton
              Icon={IoAnalyticsOutline}
              label="Best Sellers"
              delay={0.2}
            />
            <IconButton
              Icon={IoAnalyticsOutline}
              label="Hot Resto"
              delay={0.2}
            />
          </div>
        </div>
      </motion.main>
      <CustomerBottomBar />
    </>
  );
}
