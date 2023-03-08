import Head from "next/head";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const { callbackUrl } = useRouter().query;

  return (
    <>
      <Head>
        <title>Merchant Login</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between  bg-gradient-to-b px-8 py-16 ">
        <div>
          <h1 className=" text-4xl font-bold text-main">GAS! Merchant</h1>
          <p className=" text-m flex flex-col items-center pb-20 font-bold tracking-wider">
            Become a GAMA Merchant now
          </p>
        </div>
        <Image
          className="pb-20 neumorphic-shadow"
          src="/gama-logo2.png"
          width={200}
          height={200}
          alt="logo"
        />
        <div className=" w-full">
          <div className="inline-flex w-full items-center justify-center">
            <hr className="my-8 h-px w-full border bg-gray-200 " />
            <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-bold text-main">
              Log in with
            </span>
          </div>
          <div className=" flex w-full flex-row gap-4 ">
            <button
              className="  h-12 w-full rounded-xl border border-main text-lg  font-bold text-white "
              onClick={() => {
                signIn("google", {
                  callbackUrl: callbackUrl ? callbackUrl.toString() : "/",
                });
              }}
            >
              <FcGoogle className=" mx-auto h-6 w-6" />
            </button>
            <button
              className="  h-12 w-full rounded-xl bg-main text-lg font-bold text-white"
              onClick={() => {
                signIn("discord", {
                  callbackUrl: callbackUrl ? callbackUrl.toString() : "/",
                });
              }}
            >
              <FaDiscord className=" mx-auto h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pt-6">
          <p className="text-m font-medium tracking-wider text-gray-900">
            Don’t have an account?
          </p>
          <Link href={""}>
          <p className="text-m font-bold tracking-wider text-red-600">
            Sign Up
          </p>
        </Link>
        </div>
      
      </main>
    </>
  );
}
