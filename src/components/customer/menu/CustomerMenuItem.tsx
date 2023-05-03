import { MenuItem } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import { AiOutlineEdit, AiOutlineMinus } from "react-icons/ai";
import {
  BsFileMinus,
  BsHeart,
  BsHeartFill,
  BsNodeMinus,
  BsPlus,
} from "react-icons/bs";
import Spinner from "../../Spinner";
import { FaMinus, FaPlug, FaPlus } from "react-icons/fa";
import AddSubtractItem from "./AddSubtractItem";

export default function CustomerMenuItem({
  item,
  setPopup,
  quantity,
  cartId,
}: {
  item: MenuItem;
  setPopup: (item: MenuItem | null) => void;
  quantity: number;
  cartId: string;
}) {

  return (
    <>
      <div
        onClick={() => {
          setPopup(item);
        }}
        className="relative mt-4 flex h-20 w-full flex-row items-center justify-between"
      >
        <div className="relative h-20 w-32 flex-shrink-0">
          <Image
            alt="menuImage"
            fill
            src={item.thumbnail}
            className="rounded-xl object-cover"
          />
        </div>
        <div className="flex h-full max-w-full flex-1 flex-col justify-between overflow-hidden pl-4 font-bold">
          <h1 className="truncate text-ellipsis">{item.title}</h1>
          <div className=" flex flex-row items-center gap-2">
            <h2 className="text-main">{"Rp " + item.price}</h2>
            {/* {liked ? (
              <BsHeartFill
                className=" fill-main transition-all"
                onClick={(e) => {e.stopPropagation(); setLiked(false)}}
              />
            ) : (
              <BsHeart
                className=" fill-main transition-all"
                onClick={(e) => {e.stopPropagation(); setLiked(true)}}
              />
            )} */}
          </div>
          <AddSubtractItem quantity={quantity} cartId={cartId} item={item} />
          
        </div>
      </div>
      <hr className=" mt-4 h-px border-0 bg-gray-200" />
    </>
  );
}
