import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { IoDocumentLockOutline } from "react-icons/io5";
import { BsClock, BsClockFill } from "react-icons/bs";

const WaitVerification: NextPage = () => {
  return (
    <>
      <Head>
        <title>Verification Pending</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col items-center pt-20">
          <p className="w-80 text-center text-4xl font-bold tracking-widest text-red-600">
            GAS! Driver
          </p>
          <p className="text-s pt-2 font-bold tracking-wider">
            Become a GAMA Driver now
          </p>
          <p className="pt-8 text-base font-bold tracking-wider text-gray-900 pb-16">
            Data Verification Pending
          </p>
        </div>
        <div className="mx-auto flex h-72 w-80 flex-col items-center justify-center rounded-lg bg-white p-7 shadow-2xl">
          <Image
            className="mx-auto flex flex-col pb-3"
            src={"/search.png"}
            alt={"search"}
            width={60}
            height={60}
          />
          <p className="text-center font-medium tracking-wider text-gray-900">
            Your data has been accepted by our system and will be verified
            accordingly. An email will be sent when the verification is
            complete.
          </p>
          <div className="mx-auto inline-flex space-x-2 pt-5">
            <BsClock className="h-5 w-5" />
            <p className="text-base font-medium tracking-wider text-gray-900">
              Approx 2 days
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center pt-44">
          <Link href={""}>
            <div className="inline-flex h-14 w-72 items-center justify-center rounded-md border bg-red-600">
              <p className="text-xl font-bold tracking-widest text-gray-50">
                Back to Home Screen
              </p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
};

export default WaitVerification;
