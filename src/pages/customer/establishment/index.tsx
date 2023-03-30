import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsArrow90DegLeft, BsArrowLeft, BsBack, BsPinFill, BsStar, BsStarFill } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import CustomerMenuList from "../../../components/customer/menu/CustomerMenuList";
import { api } from "../../../utils/api";

export default function ViewEstablishment() {
  const [position, setPosition] = useState<GeolocationPosition>();

    useEffect(() => {   
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition(position)
        })
    }, [])

  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, error } =
    api.customer.getEstablishmentById.useQuery(
      {
        id: id?.toString()!,
      },
      {
        enabled: (!!id && !!position),
      }
    );


  if (isLoading) {
    return <div></div>;
  }


  if (data) {
    return (
      <div className=" flex flex-col gap-6">
        <div className=" w-full h-64 relative">
            <BsArrowLeft className=" absolute top-4 left-4 text-2xl fill-main z-10 bg-white rounded-full w-10 h-10 p-2" onClick={() => router.push('/customer')}/>
            <Image alt='thumbnail' fill src={data.thumbnail} className=" object-cover" />
        </div>
        <div className=" flex flex-col px-6 gap-4"> 
            <h1 className="text-2xl font-bold">
                {data.title}
            </h1>
            <hr className="h-px border-0 bg-gray-200" />
            <div className=" flex flex-row gap-4 items-center"> 
                <BsStarFill className=" fill-yellow-300"/>
                <p className=" font-bold">4.8 <span className=" font-normal">(4800 reviews)</span> </p>
            </div>
            <hr className="h-px border-0 bg-gray-200" />

            <div className=" flex flex-row gap-4 items-center"> 
                <BsPinFill className=" fill-main"/>
                <p>2.4 km</p>
            </div>
            <hr className="h-px border-0 bg-gray-200" />

            <div className=" flex flex-row gap-4 items-center"> 
                <MdLocalOffer className=" fill-main"/>
                <p>Offers Available</p>
            </div>

        </div>
        <CustomerMenuList menu={data.menu} categories={data.categories} />
      </div>
    );
  }
}
