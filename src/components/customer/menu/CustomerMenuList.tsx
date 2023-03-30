import { Category, MenuItem } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import CustomerMenuItem from "./CustomerMenuItem";

export default function CustomerMenuList({
  menu,
  categories,
}: {
  menu: MenuItem[];
  categories: Category[];
}) {
  const [popup, setPopup] = useState<MenuItem | null>(null);

  const categorizedMenu = categories.map((category) => {
    return {
      category,
      items: menu.filter((item) => item.categoryId === category.id),
    };
  });

  return (
    <>
      <div className=" flex flex-col gap-4 px-6 pb-16">
        {categorizedMenu.map((item) => (
          <div className=" " key={item.category.id}>
            <p className=" text-xl font-bold">{item.category.title}</p>
            {item.items.map((item) => (
              <CustomerMenuItem item={item} key={item.id} setPopup={setPopup} />
            ))}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {popup && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setPopup(null);
              }}
              className=" absolute top-0 z-10 h-screen w-screen bg-black/50"
            ></motion.div>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className=" fixed bottom-0 z-20 flex h-2/3 w-full flex-col justify-between rounded-t-xl bg-white px-8 py-6"
            >
              <div className=" relative w-full flex-grow rounded-xl">
                <Image
                  fill
                  src={popup.thumbnail}
                  alt="thumbnail "
                  className=" rounded-xl object-cover"
                />
              </div>
              <div className=" flex flex-col">
                <h1 className="mt-4 text-lg font-bold">{popup.title}</h1>
                <p className=" overflow-hidden truncate">{popup.description}</p>
                <div className=" mt-2 flex flex-row flex-wrap items-center gap-2">
                  <p className=" rounded-full border px-2 py-[2px] text-sm ">
                    Hi - Cal
                  </p>
                </div>
                <h2 className=" mt-4 font-bold text-main ">
                  {"Rp " + popup.price}
                </h2>
              </div>
              <button className="mt-4 flex flex-row items-center justify-center gap-2 rounded-xl bg-main px-4 py-2 text-white">
                <BsPlus />
                <p>Add to cart</p>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
