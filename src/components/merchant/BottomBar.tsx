import Link from "next/link";
import {
  BsBasket3,
  BsChat,
  BsHouseDoor,
  BsPerson,
  BsShop,
  BsWallet,
  BsWallet2,
} from "react-icons/bs";

export default function MerchantBottomBar() {
  return (
    <nav
      className=" fixed bottom-0 z-10   h-16 w-full bg-main px-2 shadow-xl "
      style={{ boxShadow: "0px 0px 18px rgba(0, 0, 0, 0.25)" }}
    >
      <div className=" flex h-full flex-row items-center justify-between px-4">
        <div className=" group flex h-10 w-10  items-center justify-center rounded-full bg-main transition-all active:bg-white">
          <BsHouseDoor className=" h-5 w-5 fill-white transition-all group-active:fill-main" />
        </div>
        <div className=" group flex h-10 w-10  items-center justify-center rounded-full   bg-main transition-all active:bg-white">
          <BsWallet2 className=" h-5 w-5 fill-white transition-all group-active:fill-main" />
        </div>

        <Link href = '/merchant'
          className=" relative bottom-4 flex h-16 w-16 flex-row items-center justify-center rounded-full bg-white  shadow-xl transition-all active:bg-neutral-300 no_highlights "
          style={{ boxShadow: "0px 0px 18px rgba(0, 0, 0, 0.25)" }}
        >
          <BsShop className=" h-6 w-6 fill-main" />
        </Link>

        <div className=" flex w-1/3 flex-row items-center justify-between">
        <Link href='/merchant/orders' className=" group flex h-10 w-10  items-center justify-center rounded-full bg-main transition-all active:bg-white no_highlights "> 
              <BsBasket3 className=" h-5 w-5 fill-white transition-all group-active:fill-main" />
            </Link>

          <Link href='/merchant/profile' className=" group flex h-10 w-10  items-center justify-center rounded-full bg-main transition-all active:bg-white no_highlights ">
            <BsPerson className=" h-5 w-5 fill-white transition-all group-active:fill-main" />
          </Link>
        </div>  
      </div>
    </nav>
  );
}
