import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  BsArrowRightShort,
  BsBell,
  BsBoxArrowLeft,
  BsEnvelope,
  BsPerson,
  BsPinAngle,
  BsQuestion,
  BsShield,
  BsShop,
  BsTrash,
} from "react-icons/bs";
import BottomBar from "../../../components/merchant/BottomBar";
import { authOptions } from "../../../server/auth";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <>
      <div className=" flex w-full flex-col p-8 py-16">
        <h1 className=" mb-8 text-3xl font-bold"> Profile</h1>
        <div className=" flex flex-row items-start gap-4">
          {session?.user.image ? (
            <Image
              src={session?.user.image}
              width={56}
              height={56}
              className="rounded-full"
              alt="profile picture"
            />
          ) : (
            <div className=" h-14 w-14 rounded-full bg-gray-200">
              <BsPerson className=" h-8 w-8" />
            </div>
          )}
          <div className=" flex flex-col">
            <h1 className=" text-xl font-bold">{session?.user.name}</h1>
            <h1 className=" w-48  overflow-hidden text-ellipsis "> {session?.user.id}</h1>
          </div>
          <p className="  ml-auto">Edit</p>
        </div>
        <hr className="border-1 my-4 h-px bg-gray-200 " />
        <p className=" flex flex-row gap-4">
          <span>
            <BsEnvelope className=" h-6 w-6 fill-neutral-500" />{" "}
          </span>
          {session?.user?.email}
        </p>
        <hr className="border-1 my-4 h-px bg-gray-200 " />
        <div className="flex w-full flex-col gap-4">
          <p className=" font-bold">Settings</p>
          <div className=" flex flex-row gap-4">
            <BsShop className=" h-6 w-6 fill-neutral-500" /> Restaurant
            <BsArrowRightShort className=" ml-auto h-6 w-6 fill-neutral-500" />{" "}
          </div>
          <hr className="border-1 h-px bg-gray-200 " />
          <div className=" flex flex-row gap-4">
            <BsPinAngle className=" h-6 w-6 fill-neutral-500" /> Address
            <BsArrowRightShort className=" ml-auto h-6 w-6 fill-neutral-500" />{" "}
          </div>
          <hr className="border-1 h-px bg-gray-200 " />
          <div className=" flex flex-row gap-4">
            <BsBell className=" h-6 w-6 fill-neutral-500" /> Notifications
            <BsArrowRightShort className=" ml-auto h-6 w-6 fill-neutral-500" />{" "}
          </div>
          <hr className="border-1 h-px bg-gray-200 " />
          <div className=" flex flex-row gap-4">
            <BsShield className=" h-6 w-6 fill-neutral-500" /> Security
            <BsArrowRightShort className=" ml-auto h-6 w-6 fill-neutral-500" />{" "}
          </div>
          <hr className="border-1 h-px bg-gray-200 " />
          <div className=" flex flex-row gap-4">
            <BsQuestion className=" h-6 w-6 fill-neutral-500" /> Help
            <BsArrowRightShort className=" ml-auto h-6 w-6 fill-neutral-500" />{" "}
          </div>
          <button onClick={() => {signOut()}} className=" mt-4 flex flex-row gap-4 text-red-500 ">
            <BsBoxArrowLeft className=" h-6 w-6 " /> Log Out
          </button>
          <div className=" mt-4 mb-16    flex flex-row gap-4 text-red-500">
            <BsTrash className=" h-6 w-6 " /> Delete Account
          </div>
        </div>
      </div>
      <BottomBar />
    </>
  );
}

export async function getServerSideProps(context: { req: any; res: any }) {
    const session = await getServerSession(context.req, context.res, authOptions);
  
    (session?.user);
  
    if (!session) {
      return {
        redirect: {
          destination: "/login?callbackUrl=/merchant",
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