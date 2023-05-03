import { MenuItem } from "@prisma/client";
import { AiOutlineMinus } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { api } from "../../../utils/api";

export default function AddSubtractItem(
    { item, quantity, cartId }: { item: MenuItem; quantity: number; cartId: string },
) {
    const utils = api.useContext();
  const { mutate, isLoading } = api.customer.updateEstablishmentCart.useMutation({
    onSettled: () => {
      utils.customer.getEstablishmentCart.invalidate();
    },
  });


    return(
        <div className="flex flex-row items-center justify-end">
            {quantity > 0 ? (
              <div className="flex flex-row items-center justify-center gap-2 rounded-xl bg-white px-2 py-1 text-xs text-main">
                <button
                  onClick={(e) => {
                    if(isLoading){
                        return
                    }
                    e.stopPropagation();
                    mutate({
                      orderItems: [
                        {
                          itemId: item.id,
                          quantity: quantity - 1,
                        },
                      ],
                      cartId: cartId,
                      establishmentId: item.establishmentId,
                    });
                  }}
                  className="flex flex-row items-center justify-center gap-2 rounded-xl bg-main px-2 py-1 text-xs text-white transition-all active:border active:border-main active:bg-white active:text-main"
                >
                  <AiOutlineMinus />
                </button>
                <p>{quantity}</p>
                <button
                  onClick={(e) => {
                    if(isLoading){
                        return
                    }
                    e.stopPropagation();
                    mutate({
                      orderItems: [
                        {
                          itemId: item.id,
                          quantity: quantity + 1,
                        },
                      ],
                      cartId: cartId,
                      establishmentId: item.establishmentId,
                    });
                  }}
                  className="flex flex-row items-center justify-center gap-2 rounded-xl bg-main px-2 py-1 text-xs text-white transition-all active:border active:border-main active:bg-white active:text-main"
                >
                  <BsPlus />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  mutate({
                    orderItems: [
                      {
                        itemId: item.id,
                        quantity: 1,
                      },
                    ],
                    cartId: cartId,
                    establishmentId: item.establishmentId,
                  });
                }}
                className="flex flex-row items-center justify-center gap-2 rounded-xl bg-main px-2 py-1 text-xs text-white transition-all active:border active:border-main active:bg-white active:text-main"
              >
                <BsPlus />
                <p>Add</p>
              </button>
            )}
          </div>
    )
}