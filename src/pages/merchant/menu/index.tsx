import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";
import CustomerMenuList from "../../../components/customer/menu/CustomerMenuList";
import MerchantMenuList from "../../../components/merchant/menu/MenuList";
import Spinner from "../../../components/Spinner";
import { authOptions } from "../../../server/auth";
import { api } from "../../../utils/api";

export default function MerchantMenu() {
  const [customerView, setCustomerView] = useState(false);
  const router = useRouter();
  const { data, isLoading, error } = api.merchant.getCurrentMerchant.useQuery();

  if (isLoading) return <Spinner />;

  if (error) return <div>{error.message}</div>;

  return (
    <main className=" relative flex min-h-screen flex-col ">
      <div className="  flex h-24 w-full flex-col bg-main px-5 py-3 text-white">
        <div className="flex h-24 items-center justify-between ">
          <IoMdArrowRoundBack
            onClick={() => router.push("/merchant")}
            className=" h-5 w-5"
          />
        </div>
        <h1 className=" text-3xl font-bold">
          {customerView
            ? data?.merchant?.establishments[0]?.title
            : "Menu List"}
        </h1>
      </div>
      <div className=" fixed bottom-2 left-2 z-20 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 shadow-lg">
        <span className="mr-3 text-sm font-bold text-main ">Customer View</span>
        <label className="no_highlights relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={customerView}
            onChange={() => {
              setCustomerView(!customerView);
            }}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-main peer-checked:after:translate-x-full peer-checked:after:border-white  " />
        </label>
      </div>
      <div className=" m-4 inline-flex items-center gap-2">
        <BsSearch className=" absolute left-8 z-10" />
        <input
          type="text"
          className=" relative h-8 min-w-0 flex-grow rounded-full border-2 border-gray-200 px-10"
        ></input>
        <button
          className=" h-8 w-8 rounded-full border-2 border-gray-200"
          type="button"
        >
          <RiListSettingsLine className=" mx-auto" />
        </button>
      </div>
      {customerView ? (
        <CustomerMenuList
          menu={data?.merchant?.establishments[0]?.menu || []}
          categories={data?.merchant?.establishments?.[0]?.categories || []}
        />
      ) : (
        <MerchantMenuList
          menu={data?.merchant?.establishments[0]?.menu || []}
        />
      )}
    </main>
  );
}

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log(session?.user);

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/merchant/menu",
        permanent: false,
      },
    };
  }

  if (!session.user.merchantId) {
    return {
      redirect: {
        destination: "/merchant/register",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
