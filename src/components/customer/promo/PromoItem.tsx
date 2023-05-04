import { useState } from "react";
import { IoFastFood } from "react-icons/io5";


export default function PromoItem({
    type
} : {type : "DELIVERY" | "FOOD"}) {
  const [selected, setSelected] = useState(false);

  return (
    <button
      onClick={
        () => setSelected((prev : boolean) => !prev)
      }
      className={`${
        !selected ? "border border-main bg-white text-main" : "bg-main text-white"
      } inline-flex w-full items-center justify-between gap-4 rounded-lg py-4 px-6 transition-all`}
    >
      <IoFastFood className=" h-9 w-9" />
      <div className=" flex flex-col">
        <p>Food Discount</p>
        <p>Up to</p>
      </div>
      <div className=" flex flex-col text-sm">
        <p>Min order.</p>
        <p>10k </p>
      </div>
    </button>
  );
}
