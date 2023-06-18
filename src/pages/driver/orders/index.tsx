import { useEffect, useState } from "react";
import DriverBottomBar from "../../../components/driver/DriverBottomBar";
import { useSession } from "next-auth/react";
import { BsArrowDown, BsCashStack, BsPersonFill } from "react-icons/bs";
import { IoLocation, IoLocationOutline } from "react-icons/io5";
import CountdownTimer from "../../../components/driver/Countdown";
import Link from "next/link";
import { api } from "../../../utils/api";
import Spinner from "../../../components/Spinner";
import OrderItem from "../../../components/driver/orders/OrderItem";

export default function OrdersPage() {
  const { data: session } = useSession();

  const { data, isLoading, error } = api.driver.orderStatusQuery.useQuery();

  return (
    <>
      <div className="w-full bg-main" style={{ height: 75 }}>
        <p className="px-12 py-5 text-3xl font-semibold tracking-widest text-gray-50">
          Orders
        </p>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center py-7">
        {isLoading && <Spinner />}
        {data &&
          data.map((order) => (
            <OrderItem
              key={order.id}
              id={order.id}
              placeName={order.establishment.address?.place_name!}
              deliveryAddress={order.deliveryAddress}
              price={order.totalPrice}
              status={order.status}
              customer={order.customer.name}
            />
          ))}
      </div>
      <DriverBottomBar />
    </>
  );
}
