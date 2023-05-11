import { Cart, Promo, OrderItem, MenuItem } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsCash } from "react-icons/bs";
import { FaArrowLeft, FaCheckCircle, FaCircle, FaWallet } from "react-icons/fa";
import { api } from "../../../../../utils/api";
import formatter from "../../../../../utils/formatter";

export default function PaymentPage() {
  const [selected, setSelected] = useState<"cash" | "ewallet">("ewallet");
  const [price, setPrice] = useState(0);
  const router = useRouter();
  const id = router.query.id as string;

  const { data: cart } = api.customer.getEstablishmentCart.useQuery(
    {
      establishmentId: id,
    },
    {
      enabled: !!id,
    }
  );

  function calculatePrice(
    cart: Cart & {
      promos: Promo[];
      orderItems: (OrderItem & {
        item: MenuItem;
      })[];
    }
  ) {
    if (!cart) return 0;
    let price = 0;
    cart.orderItems.forEach((orderItem) => {
      price += orderItem.quantity * (orderItem.item.price as unknown as number);
    });
    if (cart.promos.length > 0) {
      const promo = price * (cart.promos[0]?.amount! / 100);
      price -= promo;
    }
    console.log(price);
    return price;
  }

  useEffect(() => {
    if (cart) setPrice(calculatePrice(cart));
  }, [cart]);

  const { data: wallet } = api.wallet.getWallet.useQuery();

  const { register, handleSubmit } = useForm();

  return (
    <main className=" min-h-screen">
      <div className=" h-25 flex w-full flex-col justify-between bg-main px-6 py-4 text-white">
        <FaArrowLeft className="h-8" onClick={() => router.back()} />
        <h1 className=" text-3xl font-medium">Payment</h1>
      </div>
      <button
        onClick={() => setSelected("ewallet")}
        className="flex w-full flex-row items-center justify-between px-6"
      >
        <div className=" my-2 flex w-full flex-col items-start justify-between">
          <div className=" inline-flex items-center gap-2">
            <FaWallet className="h-8 text-main" />
            <h1 className=" text-lg font-medium">E-Wallet</h1>
          </div>
          {wallet && (
            <>
              <p>Balance : {formatter.format(wallet.balance)}</p>
              {wallet.balance < price && (
                <p className=" text-red-600">Insufficient balance</p>
              )}
            </>
          )}
        </div>
        {selected == "ewallet" ? (
          <FaCheckCircle className="h-8 text-green-600" />
        ) : (
          <FaCircle className="h-8 text-neutral-400" />
        )}
      </button>
      <hr className=" w-full" />
      <button
        onClick={() => setSelected("cash")}
        className="flex w-full flex-row items-center justify-between px-6"
      >
        <div className=" inline-flex w-full items-center justify-between ">
          <div className=" my-2 inline-flex items-center gap-2">
            <BsCash className="h-8 text-main" />
            <h1 className=" text-lg font-medium">Cash</h1>
          </div>
        </div>
        {selected == "cash" ? (
          <FaCheckCircle className="h-8 text-green-600" />
        ) : (
          <FaCircle className="h-8 text-neutral-400" />
        )}
      </button>
    </main>
  );
}
