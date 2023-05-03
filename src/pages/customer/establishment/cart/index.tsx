import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsArrowLeft, BsBack } from "react-icons/bs";
import { FaArrowLeft, FaMapMarkerAlt, FaMapPin, FaPlus, FaWallet } from "react-icons/fa";
import { TbDiscount } from "react-icons/tb";
import { api } from "../../../../utils/api";

export default function CartPage() {
  const [position, setPosition] = useState<GeolocationPosition>();

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

  return (
    <main className=" flex w-full flex-col">
      <div className=" flex h-24 w-full flex-col justify-between bg-main px-4 py-4 text-white">
        <FaArrowLeft className="h-8" />
        <h1 className=" text-3xl font-medium">{data?.title}</h1>
      </div>
      <div className=" flex flex-row items-center  gap-2 px-6 py-4 ">
        <FaMapMarkerAlt className="h-7 w-5 fill-main" />
        <div>
          <h1 className=" text-lg font-medium">
            {position?.coords.latitude + ", " + position?.coords.longitude}
          </h1>
        </div>
      </div>
      <hr className="h-px border-2 border-gray-100" />
      <div>
        <h1 className=" px-6 py-4 text-lg font-medium">Your Order</h1>
        <hr className="h-px border-2 border-gray-100" />
        <div className=" flex flex-col gap-4 px-6 py-4">
          {cart?.orderItems.map((item, index) => (
            <>
              <div className=" flex flex-row items-center justify-between">
                <div className=" relative inline-flex w-full items-center gap-4">
                  <div className=" relative h-24 w-24 ">
                    <Image
                      fill
                      alt="thumbnail"
                      src={item.item.thumbnail}
                      className=" relative rounded-full object-cover"
                    />
                  </div>
                  <div className=" flex flex-col">
                    <h1 className=" text-lg font-medium">{item.item.title}</h1>
                    <h1 className=" relative overflow-hidden truncate text-sm font-medium">
                      {item.item.description}
                    </h1>

                    <h1 className=" text-sm font-medium">
                      {"Rp. " + item.item.price.toString()}
                    </h1>
                  </div>
                </div>
              </div>
              {index !== cart.orderItems.length - 1 && (
                <hr className="h-px border bg-gray-100" />
              )}
            </>
          ))}
        </div>
        <div className=" inline-flex  w-full items-center justify-center  px-6">
          <hr className="h-px w-full border bg-gray-100" />
          <p className=" w-full text-center text-main">Add Items</p>
          <hr className="h-px w-full border bg-gray-100" />
        </div>
        <div className="mt-4 flex flex-col bg-main rounded-xl text-white text-xl font-bold gap-2 mx-6 px-4 py-2">
            <div className=" inline-flex items-center gap-2 py-2">
              <TbDiscount />
              <div>
                Vouchers
              </div>
            </div>
            <hr className="h-px border bg-white" />
            <div className=" inline-flex items-center gap-2 py-2">
              <FaWallet />
              <div>
                Payment
              </div>
            </div>
        </div>
      </div>
    </main>
  );
}
