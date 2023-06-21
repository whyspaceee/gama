import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsArrowLeft, BsBack } from "react-icons/bs";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMapPin,
  FaPlus,
  FaWallet,
} from "react-icons/fa";
import { TbDiscount } from "react-icons/tb";
import AddSubtractItem from "../../../../components/customer/menu/AddSubtractItem";
import { api } from "../../../../utils/api";
import formatter from "../../../../utils/formatter";

export default function CartPage() {
  const [position, setPosition] = useState<GeolocationPosition>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(4000);
  const [serviceFee, setServiceFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryDiscount, setDeliveryDiscount] = useState(0);

  const { mutate } = api.customer.createOrderMutation.useMutation({
    onSuccess: (data) => {
      router.push(`/customer`);
    },
  });

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

  const { data: location } = api.geocoding.reverseGeocode.useQuery(
    {
      lat: position?.coords.latitude!,
      lng: position?.coords.longitude!,
    },
    {
      enabled: !!position,
    }
  );

  const {data: fee} = api.customer.orderFee.useQuery({
    establishmentId: id?.toString()!,
    lat: position?.coords.latitude!,
    lng: position?.coords.longitude!
  }, {
    enabled: !!location && !!id
  })



  useEffect(() => {
    if (cart) {
      if (cart.orderItems.length === 0) {
        setDeliveryFee(0);
        setServiceFee(0);
      }
    }
  }, [cart]);

  useEffect(() => {
    if (cart) {
      let total = 0;
      cart.orderItems.forEach((item) => {
        total += (item.item.price as unknown as number) * item.quantity;
      });
      setTotalPrice(total);
    }
  }, [cart]);

  useEffect(() => {
    if (cart?.promos) {
      const total = cart.promos.reduce((acc, promo) => {
        return acc + promo.amount;
      }, 0);
      const discount = (total * totalPrice) / 100;
      setDiscount(discount);
    }
  }, [cart, totalPrice]);

  return (
    <main className=" flex w-full flex-col">
      <div className=" h-25 flex w-full flex-col justify-between bg-main px-6 py-4 text-white">
        <FaArrowLeft
          className="h-8"
          onClick={() => router.push(`/customer/establishment?id=${id}`)}
        />
        <h1 className=" text-3xl font-medium">{data?.title}</h1>
      </div>
      <div className=" flex flex-row items-center  gap-2 px-6 py-4 ">
        <FaMapMarkerAlt className="h-7 w-5 flex-shrink-0 fill-main" />
        <div className=" overflow-hidden">
          <h1 className=" truncate text-lg font-medium">
            {location?.[0]?.place_name}
          </h1>
        </div>
      </div>
      <hr className="h-px border-2 border-gray-100" />
      <div>
        <h1 className=" px-6 py-4 text-lg font-medium">Your Order</h1>
        <hr className="h-px border-2 border-gray-100" />
        <div className=" flex flex-col gap-4 px-6 py-4">
          {cart?.orderItems
            .sort((a, b) => a.item.title.localeCompare(b.item.title))
            .map((item, index) => (
              <>
                <div className=" flex flex-row items-center justify-between">
                  <div className=" relative inline-flex w-full items-center gap-4">
                    <div className=" relative h-24 w-32 flex-shrink-0 ">
                      <Image
                        fill
                        alt="thumbnail"
                        src={item.item.thumbnail}
                        className=" relative rounded-xl object-cover"
                      />
                    </div>
                    <div className=" flex flex-grow flex-col overflow-hidden ">
                      <h1 className=" overflow-hidden truncate text-lg font-medium">
                        {item.item.title}
                      </h1>
                      <h1 className=" relative overflow-hidden truncate text-sm font-medium">
                        {item.item.description}
                      </h1>

                      <h1 className=" text-sm font-medium">
                        {formatter.format(item.item.price as unknown as number)}
                      </h1>
                      <AddSubtractItem
                        quantity={item.quantity}
                        cartId={cart.id}
                        item={item.item}
                      />
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
        <div className="mx-6 mt-4 flex flex-col gap-2 rounded-xl bg-main px-4 py-2 text-xl font-bold text-white">
          <div className=" inline-flex items-center gap-2 py-2">
            <TbDiscount />
            <Link href={`/customer/establishment/promo?id=${id}`}>
              {cart?.promos.length
                ? `${cart?.promos.length} Promos Used`
                : "Promos"}
            </Link>
          </div>
          <hr className="h-px border bg-white" />
          <Link
            href={`/customer/establishment/cart/payment?id=${id}`}
            className=" inline-flex items-center gap-2 py-2"
          >
            <FaWallet />
            <div>Payment</div>
          </Link>
        </div>
      </div>
      <div className=" neumorphic-shadow -z-10 mx-6 my-4 flex flex-col gap-2 rounded-xl bg-white px-6 py-4">
        <div className=" flex flex-row items-center justify-between">
          <h1 className=" text-sm font-medium">Subtotal</h1>
          <h1 className=" text-sm font-medium">
            {formatter.format(totalPrice)}
          </h1>
        </div>
        <div className=" flex flex-row items-center justify-between">
          <h1 className=" text-sm font-medium">Delivery Fee</h1>
          <h1 className=" text-sm font-medium">
            {formatter.format(fee || 0)}
          </h1>
        </div>
        <div className=" flex flex-row items-center justify-between">
          <h1 className=" text-sm font-medium">Service Fee</h1>
          <h1 className=" text-sm font-medium">
            {formatter.format(serviceFee)}
          </h1>
        </div>
        <div className=" flex flex-row items-center justify-between">
          <h1 className=" text-sm font-medium">Discount</h1>
          <h1 className=" text-sm font-medium">{formatter.format(discount)}</h1>
        </div>
        <div className=" flex flex-row items-center justify-between">
          <h1 className=" text-sm font-medium">Total</h1>
          <h1 className=" text-sm font-medium">
            {formatter.format(totalPrice + (fee || 0) + serviceFee - discount)}
          </h1>
        </div>
      </div>
      <div className=" mx-6 my-4">
        {cart?.orderItems.length !== 0 && (
          <button
            onClick={() => {
              if (
                cart?.id &&
                id &&
                position?.coords?.latitude &&
                position?.coords?.longitude &&
                location?.[0]?.place_name
              ) {
                mutate({
                  cartId: cart?.id,
                  establishmentId: id.toString(),
                  paymentType: "EWALLET",
                  lat: position?.coords?.latitude,
                  lng: position?.coords?.longitude,
                  address: location?.[0]?.place_name
                  
                });
              }
            }}
            className=" relative w-full  rounded-full  bg-main  py-2 px-4 text-center text-lg font-bold  text-white"
          >
            Place Order
            </button>
        )}
        {cart?.orderItems.length === 0 && (
          <div className=" relative w-full  rounded-full bg-gray-400  py-2 px-4 text-center text-lg font-bold  text-white">
            Your cart is empty
          </div>
        )}
      </div>
    </main>
  );
}
