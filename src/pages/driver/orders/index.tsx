import { useEffect, useState } from "react";
import DriverBottomBar from "../../../components/driver/DriverBottomBar";
import { useSession } from "next-auth/react";
import {
  BsArrowDown,
  BsCashStack,
  BsPersonFill,
} from "react-icons/bs";
import {IoLocation, IoLocationOutline } from "react-icons/io5";
import CountdownTimer from "../../../components/driver/Countdown";


export default function OrdersPage() {
  const { data: session } = useSession();

  return (
    <>
      <div className="w-full bg-main" style={{ height: 75 }}>
        <p className="px-12 py-5 text-3xl font-semibold tracking-widest text-gray-50">
          Orders
        </p>
      </div>
      <div className="flex justify-center py-7">
        <div className="w-10/12 rounded-lg bg-gray-50 shadow-lg">
          <div className="px-7 py-7">
            <div className="flex">
              <BsPersonFill className="h-8 w-8" />
              <p className="px-2 text-xl font-bold tracking-widest text-gray-900">
                AnasBS
              </p>
            </div>
            <div className="flex pt-6">
              <IoLocationOutline className="h-8 w-8" />
              <div className="item-center flex flex-col px-2">
                <p className=" text-s font-extrabold tracking-wider text-gray-900">
                  Nasi Goreng Jalvaro
                </p>
                <p className="text-xs font-semibold tracking-wider text-gray-900">
                  Jl. Jamal No. 69
                </p>
              </div>
            </div>
            <BsArrowDown className="h-8 w-8" />
            <div className="flex py-1">
              <IoLocation className="h-8 w-8" />
              <div className="px-2">
                <p className=" text-s font-extrabold tracking-wider text-gray-900">
                  FMIPA UGM
                </p>
                <p className="text-xs font-semibold tracking-wider text-gray-900">
                  Gedung C, Lantai 4
                </p>
              </div>
            </div>
            <div className="flex justify-between pt-9">
              <p className="text-s font-bold tracking-wider text-gray-900">
                Price
              </p>
              <p className="text-s text-right font-bold tracking-wider text-gray-900">
                Rp 20.000
              </p>
            </div>
            <div className="flex justify-between pt-4">
              <p className="text-s font-bold tracking-wider text-gray-900">
                Earnings
              </p>
              <p className="text-s text-right font-bold tracking-wider text-gray-900">
                Rp 8.000
              </p>
            </div>
            <div className="flex justify-between pt-4">
              <p className="text-s font-bold tracking-wider text-gray-900">
                Fees
              </p>
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
            <div className="flex justify-around pt-5">
              <div className="h-8 w-24 rounded-lg border border-red-600 border-opacity-90 bg-red-100 bg-opacity-30">
                <p className="text-s items-center justify-center py-1 text-center font-bold tracking-wider text-red-600">
                  Reject
                </p>
              </div>
              <div className="h-8 w-36 rounded-lg border border-green-600 border-opacity-90 bg-green-100 bg-opacity-30">
                <div className="flex justify-evenly">
                    <p className="text-s py-1 text-start font-bold tracking-wider text-green-600">
                      Accept
                    </p>
                    <p className="text-s py-1 text-center font-bold tracking-wider text-green-600">
                        <CountdownTimer/>
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DriverBottomBar />
    </>
  );
}
