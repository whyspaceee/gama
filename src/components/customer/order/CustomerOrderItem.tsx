import { Status } from "@prisma/client";
import Link from "next/link";
import { BsPersonFill, BsArrowDown, BsCashStack } from "react-icons/bs";
import { IoLocationOutline, IoLocation } from "react-icons/io5";
import { api } from "../../../utils/api";
import formatter from "../../../utils/formatter";
import formatStatus from "../../../utils/formatStatus";

export default function CustomerOrderItem({
  id,
  placeName,
  deliveryAddress,
  price,
  status,
  customer,
}: {
  id: string;
  placeName: string;
  deliveryAddress: string;
  price: number | undefined;
  status: Status;
  customer: string;
}) {
  const utils = api.useContext();
  const { mutate } = api.merchant.orderStatusMutation.useMutation({
    onSettled: () => {
      utils.merchant.getCurrentOrders.invalidate();
    },
  });

  return (
    <Link
      href={`/customer/orders/details?id=${id}`}
      className="w-10/12 rounded-lg bg-gray-50 shadow-lg border"
    >
      <div className="px-8 py-4">

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
            <p className=" text-s font-extrabold tracking-wider text-gray-900">
              {customer}
            </p>
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
        
              <div className="flex justify-start mt-2 ">
                <p className="text-s py-1 text-start font-bold tracking-wider text-green-600">
                  {
                    formatStatus(status)
                  }
                </p>
                <p className="text-s py-1 text-center font-bold tracking-wider text-green-600"></p>
              </div>
   
      </div>
    </Link>
  );
}
