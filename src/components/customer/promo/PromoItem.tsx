import { Promo } from "@prisma/client";
import { useState } from "react";
import { IoFastFood } from "react-icons/io5";
import { api } from "../../../utils/api";

export default function PromoItem({
  type,
  inCart,
  cartId,
  establishmentId,
  promo
}: {
  type: "DELIVERY" | "FOOD";
  inCart: boolean;
  promo: Promo
  establishmentId: string;
  cartId: string;
}) {
  const utils = api.useContext();

  const { mutate } = api.customer.updateCartPromos.useMutation({
    onSettled: () => {
      utils.customer.getEstablishmentCart.invalidate();
    },
  });

  return (
    <button
      onClick={() => {
        mutate({
          promoIds: [promo.id],
          cartId: cartId,
        });
      }}
      className={`${
        inCart ? "border border-main bg-white text-main" : "bg-main text-white"
      } inline-flex w-full items-center justify-between gap-4 rounded-lg py-4 px-6 transition-all`}
    >
      <IoFastFood className=" h-9 w-9" />
      <div className=" flex flex-col">
        <p>Food Discount {promo.amount}%</p>
        <p>Up to</p>
      </div>
      <div className=" flex flex-col text-sm">
        <p>Min order.</p>
        <p>10k </p>
      </div>
    </button>
  );
}
