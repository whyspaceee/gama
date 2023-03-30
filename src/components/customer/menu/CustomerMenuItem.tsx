import { MenuItem } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import { AiOutlineEdit } from "react-icons/ai";
import { BsHeart, BsHeartFill } from "react-icons/bs";

export default function CustomerMenuItem({ item , setPopup }: { item: MenuItem, setPopup: (item: MenuItem | null) => void }) {
  const utils = api.useContext();
  const { mutate } = api.merchant.changeStock.useMutation({
    onSettled: async () => {
      await utils.merchant.getCurrentMerchant.invalidate();
    },
  });
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  return (
    <>
      <button onClick={() => {setPopup(item)}} className="mt-4 relative flex h-20 w-full flex-row items-center justify-between pr-6">
        <div className="relative h-20 w-32 flex-shrink-0">
          <Image
            alt="menuImage"
            fill
            src={item.thumbnail}
            className="rounded-xl object-cover"
          />
        </div>
        <div className="flex max-w-full flex-1 flex-col overflow-hidden p-4 font-bold">
          <h1 className="truncate text-ellipsis">{item.title}</h1>
          <div className=" flex flex-row items-center gap-2">
            <h2 className="text-main">{"Rp " + item.price}</h2>
            {liked ? (
              <BsHeartFill
                className=" fill-main transition-all"
                onClick={(e) => {e.stopPropagation(); setLiked(false)}}
              />
            ) : (
              <BsHeart
                className=" fill-main transition-all"
                onClick={(e) => {e.stopPropagation(); setLiked(true)}}
              />
            )}
          </div>
        </div>
      </button>
      <hr className=" mt-4 h-px border-0 bg-gray-200" />
    </>
  );
}
