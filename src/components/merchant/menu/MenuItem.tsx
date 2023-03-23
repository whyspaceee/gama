import { MenuItem } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import { AiOutlineEdit } from "react-icons/ai";

export default function MerchantMenuItem({ item }: { item: MenuItem }) {
  const utils = api.useContext();
  const { mutate } = api.merchant.changeStock.useMutation({
    onSettled : async () => {
      await utils.merchant.getCurrentMerchant.invalidate();
    },
  });
  const router = useRouter();

  return (
    <div className=" relative h-64 w-full overflow-hidden rounded-xl border border-gray-200 shadow-xl transition-shadow active:shadow-none">
      <Image
        alt="menuImage"
        fill
        src={item.thumbnail}    
        className=" rounded-xl object-cover"
      />
      <button type="button" onClick={() => router.push(`/merchant/menu/edit?id=${item.id}`)} className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg" >
          <AiOutlineEdit className=" w-5 h-5   fill-main" />
      </button>
      <div className=" absolute bottom-0 z-10 flex h-24 w-full flex-col bg-white px-4  py-2">
        <p className=" overflow-hidden truncate text-lg font-bold">
          {item.title}
        </p>
        <p className=" text overflow-hidden truncate font-medium">
          {"Rp " + item.price.toString()}
        </p>
        <div className=" inline-flex w-full items-center justify-between">
          <p className=" text overflow-hidden truncate font-medium">Stock</p>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => {
                if (item.stock > 0) {
                  mutate({
                    menuId: item.id,
                    stock: item.stock - 1,
                  });
                }
              }}
              className="rounded-l-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
            >
              -
            </button>
            <button
              type="button"
              className="border-t border-b border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
            >
              {item.stock}
            </button>
            <button
              type="button"
              onClick={() => {
                mutate({
                  menuId: item.id,
                  stock: item.stock + 1,
                });
              }}
              className="rounded-r-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
