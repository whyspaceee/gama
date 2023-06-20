import Link from "next/link";
import { BsPersonFill, BsArrowDown, BsCashStack } from "react-icons/bs";
import { IoLocationOutline, IoLocation } from "react-icons/io5";
import formatter from "../../../utils/formatter";
import { api } from "../../../utils/api";
import { Status } from "@prisma/client";
import formatStatus from "../../../utils/formatStatus";

export default function OrderItem({
  id,
  placeName,
  deliveryAddress,
  price,
  status,
  customer,
  earning
}: {
  id: string;
  placeName: string;
  deliveryAddress: string;
  price: number | undefined;
  status: Status;
  customer:string;
  earning: number
}) {

  const utils = api.useContext();
  const { mutate } = api.merchant.orderStatusMutation.useMutation({
    onSettled: () => {
      utils.merchant.getCurrentOrders.invalidate();
    },
  });

  return (
    <Link
      href={`/driver/orders/details?id=${id}`}
      className="w-10/12 rounded-lg bg-gray-50 shadow-lg border"
    >
      <div className="px-7 py-16">
        <div className="flex">
          <BsPersonFill className="h-8 w-8" />
          <p className="px-2 text-xl font-bold tracking-widest text-gray-900">
            {customer}
          </p>
        </div>
        <div className="flex pt-6">
          <IoLocationOutline className="h-8 w-8" />
          <div className="item-center flex flex-col overflow-hidden px-2">
            <p className=" text-s font-extrabold tracking-wider text-gray-900">
              Nasi Goreng Jalvaro
            </p>
            <p className="truncate text-xs font-semibold tracking-wider text-gray-900">
              {placeName}
            </p>
          </div>
        </div>
        <BsArrowDown className="h-8 w-8" />
        <div className="flex py-1">
          <IoLocation className="h-8 w-8" />
          <div className="overflow-hidden px-2">
            <p className="truncate text-xs font-semibold tracking-wider text-gray-900">
              {deliveryAddress}
            </p>
          </div>
        </div>
        <div className="flex justify-between pt-9">
          <p className="text-s font-bold tracking-wider text-gray-900">Price</p>
          <p className="text-s text-right font-bold tracking-wider text-gray-900">
            {formatter.format(price || 0)}
          </p>
        </div>
        <div className="flex justify-between pt-4">
          <p className="text-s font-bold tracking-wider text-gray-900">
            Earnings
          </p>
          <p className="text-s text-right font-bold tracking-wider text-gray-900">
            {formatter.format(earning)}
          </p>
        </div>
        <div className="flex justify-between pt-4">
          <p className="text-s font-bold tracking-wider text-gray-900">Fees</p>
          <p className="text-s text-right font-bold tracking-wider text-gray-900">
            Rp 0
          </p>
        </div>
        <div>
          <div className="flex justify-start pt-9">
            <BsCashStack className="h-10 w-6" />
            <p className="text-s h-3 w-56 px-4 pt-2 tracking-wider text-gray-500 text-opacity-70">
              Payment with Gas! Pay
            </p>
          </div>
        </div>

        {status === "ORDER_ACCEPTED" ? (
          <div className="flex justify-around pt-5">
            <div className="rounded-lg border border-red-600 border-opacity-90 bg-red-100 bg-opacity-30 py-1 px-8">
              <p className="text-s items-center justify-center py-1 text-center font-bold tracking-wider text-red-600">
                Reject
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                mutate({ orderId: id, status: "DRIVER_FOUND" });
              }}
              className="rounded-lg border border-green-600 border-opacity-90 bg-green-100 bg-opacity-30 py-1 px-8"
            >
              <div className="flex justify-evenly">
                <p className="text-s py-1 text-start font-bold tracking-wider text-green-600">
                  Accept
                </p>
                <p className="text-s py-1 text-center font-bold tracking-wider text-green-600"></p>
              </div>
            </button>
          </div>
        ) : (
          <div>Status: {formatStatus(status)}</div>
        )}
      </div>
    </Link>
  );
}
