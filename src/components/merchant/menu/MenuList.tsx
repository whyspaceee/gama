import { MenuItem } from "@prisma/client";
import { useRouter } from "next/router";
import { BsPlus } from "react-icons/bs";
import MerchantMenuItem from "./MenuItem";

export default function MerchantMenuList({ menu }: { menu: MenuItem[] }) {
    const router = useRouter();
  return (
    <div className=" flex flex-col gap-4 px-4 pb-16">
      {menu.map((item) => (
        <MerchantMenuItem item={item} key={item.id} />
      ))}
      <button onClick={() => {router.push('/merchant/menu/add')}} type="button" className=" flex items-center justify-center relative h-64 w-full overflow-hidden rounded-xl border border-gray-200 transition-shadow ">
        <BsPlus className=" w-24 h-24 border-gray-200 border-2 rounded-full fill-gray-200"/>
      </button>
    </div>
  );
}
