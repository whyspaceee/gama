import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import PromoItem from "../../../../components/customer/promo/PromoItem";
import { api } from "../../../../utils/api";

export default function PromoPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: establishment,
    isLoading,
    error,
  } = api.customer.getEstablishmentById.useQuery(
    {
      id: id?.toString()!,
    },
    {
      enabled: !!id,
    }
  );

  const { data: promos } = api.customer.getPromosFromEstablishment.useQuery(
    {
      establishmentId: establishment?.id!,
    },
    {
      enabled: !!establishment,
    }
  );

  const { data: cart } = api.customer.getEstablishmentCart.useQuery(
    {
      establishmentId: establishment?.id!,
    },
    {
      enabled: !!establishment,
    }
  );

  const utils = api.useContext();

  

  useEffect(() => {
    if (!establishment) {
      router.back();
    }
  });


  return (
    <main className=" flex w-full flex-col">
      <div className=" flex h-24 w-full flex-col justify-between overflow-hidden bg-main px-4 py-4 text-white">
        <button onClick={() => router.back()}>
          <FaArrowLeft className="h-8" />
        </button>
        <h1 className=" truncate text-xl font-medium">
          Available Promos For {establishment?.title}
        </h1>
      </div>
      <p className=" my-4 text-center text-sm">
        Select up to 1 food discount and 1 delivery discount
      </p>
      <div className=" flex flex-col gap-4 px-6">
        {promos?.map((promo) => (
            <PromoItem
                type="DELIVERY"
                key={promo.id}
                promo={promo}
                inCart={!!cart?.promos.find((p) => p.id === promo.id)}
                cartId={cart?.id!}
                establishmentId={establishment?.id!}
            />
        ))}

      </div>
    </main>
  );
}
