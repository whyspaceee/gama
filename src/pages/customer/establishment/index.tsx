import { MenuItem } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BsArrow90DegLeft,
  BsArrowLeft,
  BsBack,
  BsPinFill,
  BsStar,
  BsStarFill,
} from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import CustomerMenuList from "../../../components/customer/menu/CustomerMenuList";
import { api } from "../../../utils/api";

export default function ViewEstablishment() {
  const [position, setPosition] = useState<GeolocationPosition>();
  const [popup, setPopup] = useState<MenuItem | null>(null);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition(position);
    });
  }, []);

  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, error } = api.customer.getEstablishmentById.useQuery(
    {
      id: id?.toString()!,
    },
    {
      enabled: !!id && !!position,
    }
  );

  const { data: cart } = api.customer.getEstablishmentCart.useQuery(
    {
      establishmentId: id?.toString()!,
    },
    {
      enabled: !!id,
    }
  );


  if (isLoading) {
    return <div></div>;
  }

  if (data) {
    return (
      <div className=" flex flex-col gap-6">
        <div className=" relative h-64 w-full">
          <BsArrowLeft
            className=" absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-white fill-main p-2 text-2xl"
            onClick={() => router.push("/customer")}
          />
          <Image
            alt="thumbnail"
            fill
            src={data.thumbnail}
            className=" object-cover"
          />
        </div>
        <div className=" flex flex-col gap-4 px-6">
          <h1 className="text-2xl font-bold">{data.title}</h1>
          <hr className="h-px border-0 bg-gray-200" />
          <div className=" flex flex-row items-center gap-4">
            <BsStarFill className=" fill-yellow-300" />
            <p className=" font-bold">
              4.8 <span className=" font-normal">(4800 reviews)</span>{" "}
            </p>
          </div>
          <hr className="h-px border-0 bg-gray-200" />

          <div className=" flex flex-row items-center gap-4">
            <BsPinFill className=" fill-main" />
            <p>2.4 km</p>
          </div>
          <hr className="h-px border-0 bg-gray-200" />

          <div className=" flex flex-row items-center gap-4">
            <MdLocalOffer className=" fill-main" />
            <p>Offers Available</p>
          </div>
        </div>
        <CustomerMenuList menu={data.menu} categories={data.categories} popup={popup} setPopup={setPopup} />
        <AnimatePresence>
          {(cart?.orderItems.length && !popup  ) && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className=" fixed bottom-0 w-full bg-white p-4 shadow"
            >
              <Link href={`/customer/establishment/cart?id=${id}`}>
                <div className=" relative w-full  bg-main  rounded-full  py-2 px-4 text-center text-lg font-bold  text-white">
                  Cart
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
}
