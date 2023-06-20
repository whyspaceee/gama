import { Tab } from "@headlessui/react";
import { BsPersonFill, BsArrowDown, BsCashStack } from "react-icons/bs";
import { IoLocationOutline, IoLocation } from "react-icons/io5";
import CountdownTimer from "../../../components/driver/Countdown";
import PendingOrderItem from "../../../components/merchant/orders/PendingOrderItem";
import { api } from "../../../utils/api";
import MerchantOrderItem from "../../../components/merchant/orders/PendingOrderItem";
import Spinner from "../../../components/Spinner";
import MerchantBottomBar from "../../../components/merchant/BottomBar";

export default function OrderPage() {
  const { data, isLoading } = api.merchant.getCurrentOrders.useQuery();

  return (
    <main className=" flex min-h-screen flex-col pb-32">
      <div className="w-full bg-main" style={{ height: 75 }}>
        <p className="px-12 py-5 text-3xl font-semibold tracking-widest text-gray-50">
          Orders
        </p>
      </div>

      <div className="mx-6 my-6 flex flex-col gap-4">
        {isLoading && <Spinner />}
        {data &&
          data.map((order) => (
            <MerchantOrderItem
              key={order.id}
              id={order.id}
              username={order.customer.name}
              items={order.cart?.orderItems!}
              location={order.deliveryAddress}
              status={order.status}
            />
          ))}
      </div>
      <MerchantBottomBar />
    </main>
  );
}
