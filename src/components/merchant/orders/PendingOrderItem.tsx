import { MenuItem, OrderItem, Status } from "@prisma/client";
import { BsPersonFill } from "react-icons/bs";
import { IoLocation } from "react-icons/io5";
import formatter from "../../../utils/formatter";
import { api } from "../../../utils/api";

export default function MerchantOrderItem({
  username,
  items,
  location,
  status,
  id
}: {
  id: string;
  username: string;
  location: string;
  status: Status;
  items: (OrderItem & {
    item: MenuItem;
  })[];
}) {

  const utils = api.useContext()

  const { mutate } = api.merchant.orderStatusMutation.useMutation(
    {
      onSettled: () => {
        utils.merchant.getCurrentOrders.invalidate() 
      }
    }
  );

  return (
    <div className="rounded-xl px-7 py-7 shadow-xl border">
      <div className="flex">
        <BsPersonFill className="h-8 w-8" />
        <p className="px-2 text-xl font-bold tracking-widest text-gray-900">
          {username}
        </p>
      </div>

      <div className="my-4 flex">
        <IoLocation className="h-8 w-8" />
        <div className="px-2">
          <p className=" text-s font-extrabold tracking-wider text-gray-900">
            {location}
          </p>
        </div>
      </div>
      {items.map((item) => (
        <div className="flex justify-between py-2">
          <p className="text-s w-1/2 truncate font-bold tracking-wider text-gray-900">
            {item.quantity}x {item.item.title}
          </p>
          <p className="text-s truncate text-right font-bold tracking-wider text-gray-900">
            {formatter.format(
              (item.item.price as unknown as number) * item.quantity
            )}
          </p>
        </div>
      ))}
      <div className="flex justify-between pt-4">
        <p className="text-s font-bold tracking-wider text-gray-900">Total</p>
        <p className="text-s text-right font-bold tracking-wider text-gray-900">
          {formatter.format(
            items.reduce(
              (acc, item) =>
                acc + (item.item.price as unknown as number) * item.quantity,
              0
            )
          )}
        </p>
      </div>

      {status == "STARTED" ? (
        <div className="flex justify-around pt-5">
          <button
          onClick={() => {
            mutate({
              orderId: id,
              status: "ORDER_DECLINED",
            });
          }}
          
          className=" py-1 px-8 rounded-lg border border-red-600 border-opacity-90 bg-red-100 bg-opacity-30">
            <div className="text-s items-center justify-center py-1 text-center font-bold tracking-wider text-red-600">
              Reject
            </div>
          </button>
          <button onClick={() => {
            mutate({
              orderId: id,
              status: "ORDER_ACCEPTED",
            });
          }} className="py-1 px-8 rounded-lg border border-green-600 border-opacity-90 bg-green-100 bg-opacity-30">
            <div className="flex justify-evenly">
              <p className="text-s py-1 text-start font-bold tracking-wider text-green-600">
                Accept
              </p>
            </div>
          </button>
        </div>
      ) : (
        <div className=" text-lg mt-4" >Status: {status}</div>
      )}
    </div>
  );
}
