import { MenuItem } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import { AiOutlineEdit, AiOutlineMinus } from "react-icons/ai";
import { BsFileMinus, BsHeart, BsHeartFill, BsNodeMinus, BsPlus } from "react-icons/bs";
import Spinner from "../../Spinner";
import { FaMinus, FaPlug, FaPlus } from "react-icons/fa";

export default function CustomerMenuItem({ item , setPopup, quantity, cartId }: { item: MenuItem, setPopup: (item: MenuItem | null) => void , quantity:number, cartId: string}) {
  const utils = api.useContext();
  console.log(cartId)
  const {mutate } = api.customer.updateEstablishmentCart.useMutation(
    {
      onSettled: () => {
        utils.customer.getEstablishmentCart.invalidate()
      }
    }
  );
  return (
    <>
      <div onClick={() => {setPopup(item)}} className="mt-4 relative flex h-20 w-full flex-row items-center justify-between">
        <div className="relative h-20 w-32 flex-shrink-0">
          <Image
            alt="menuImage"
            fill
            src={item.thumbnail}
            className="rounded-xl object-cover"
          />
        </div>
        <div className="flex max-w-full flex-1 flex-col overflow-hidden pl-4 h-full justify-between font-bold">
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
          <div className="flex flex-row items-center justify-end">
          { quantity > 0 ? 
          <div className="flex flex-row text-xs items-center justify-center gap-2 px-2 py-1 rounded-xl bg-white text-main">
            <button
            onClick={(e) => {
              e.stopPropagation();
              mutate({
                orderItems: [{
                  itemId: item.id,
                    quantity: quantity -1,
                }],
                cartId: cartId,
                establishmentId: item.establishmentId
              })


            }}
            className="flex active:bg-white active:text-main active:border active:border-main transition-all flex-row text-xs items-center justify-center gap-2 px-2 py-1 rounded-xl bg-main text-white"
          >
            <AiOutlineMinus />
          </button>
            <p>{quantity}</p>
            <button
            onClick={(e) => {
              e.stopPropagation();
              mutate({
                orderItems: [{
                  itemId: item.id,
                    quantity: quantity + 1,
                }],
                cartId: cartId,
                establishmentId: item.establishmentId
              })


            }}
            className="flex active:bg-white active:text-main active:border active:border-main transition-all flex-row text-xs items-center justify-center gap-2 px-2 py-1 rounded-xl bg-main text-white"
          >
            <BsPlus />
          </button>
            
          </div> :
          <button
            onClick={(e) => {
              e.stopPropagation();
              mutate({
                orderItems: [{
                  itemId: item.id,
                    quantity: 1,
                }],
                cartId: cartId,
                establishmentId: item.establishmentId
              })


            }}
            className="flex active:bg-white active:text-main active:border active:border-main transition-all flex-row text-xs items-center justify-center gap-2 px-2 py-1 rounded-xl bg-main text-white"
          >
            <BsPlus />
            <p>Add</p>
          </button>
          } 
          </div>
        </div>


      </div>
      <hr className=" mt-4 h-px border-0 bg-gray-200" />
    </>
  );
}
