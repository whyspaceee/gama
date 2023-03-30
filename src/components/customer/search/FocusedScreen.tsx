import Image from "next/image";
import { BsStar, BsStarFill } from "react-icons/bs";
import { TbDiscount, TbDiscount2 } from "react-icons/tb";
import { Swiper, SwiperSlide } from "swiper/react";

export default function FocusedScreen({ data }: { data: any }) {
    console.log(data[0].menu)
  return (
    <div className=" flex flex-col gap-4">
      <div>
        <h1 className=" mb-4 text-xl font-bold">Matching Restos</h1>
        <div className=" flex flex-col gap-4">
          {data.map((resto: any) => (
            <div className=" flex flex-col gap-4" key={resto.id}>
              <div className=" relative flex flex-row items-start gap-4">
                <div className=" relative h-24 w-24 flex-shrink-0 rounded-xl bg-gray-200">
                  <Image
                    fill
                    alt="thumbnail"
                    src={resto.thumbnail}
                    className="object cover rounded-xl"
                  />
                </div>
                <div className=" relative flex h-24 flex-col justify-between overflow-hidden ">
                  <h1 className=" text-lg font-semibold leading-none">
                    {resto.title}
                  </h1>
                  <h2 className=" truncate text-ellipsis text-sm font-semibold text-gray-500">
                    {((resto.distance / 1000) as number).toFixed(2)} km |{" "}
                    {resto.address.text}
                  </h2>
                  <div className=" bg-red inline-flex items-center gap-2 text-sm">
                    <BsStarFill className="fill-yellow-500" />
                    <p className=" leading-none">4.7</p>
                  </div>
                  <div className=" mt-4 inline-flex items-center gap-1 truncate">
                    <TbDiscount className=" h-4 w-4 text-main" />
                    <p className=" text-sm">60% Discount, free delivery</p>
                  </div>
                </div>
              </div>

              {resto.menu.length > 0 && (
                <div className=" h-40 overflow-x-scroll flex flex-row gap-4">
                  {resto.menu?.map((item: any) => (
                    <div className="relative w-24 flex-shrink-0 flex flex-col items-center justify-start gap-2 h-full">
                      <div className="relative w-full h-24 flex-shrink-0 rounded-xl bg-red-200">
                        <Image
                          fill
                          alt="thumbnail"
                          src={item.thumbnail}
                          className="object-cover rounded-xl bg-red-200"
                        />
                      </div>
                      <div className="relative flex flex-col h-full w-full gap-1 overflow-hidden">
                        <h1 className="font-semibold leading-none h-8 overflow-hidden text-ellipsis">{item.title}</h1>
                        <h2 className="truncate text-ellipsis text-sm font-semibold text-gray-500">
                          Rp {item.price}
                        </h2>
                      </div>
                    </div>
                    
                  ))}
                  </div>
              )}
              <hr className=" h-px border-0 bg-gray-200" />
              
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
}
