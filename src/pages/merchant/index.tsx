import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { authOptions } from "../../server/auth";
import type { Session } from "next-auth";
import { api } from "../../utils/api";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Register from "./register";

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log(session?.user);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
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

export default function Merchant() {
  return (
    <>
      <div>Merchant</div>
      <button
        onClick={() => {
          signOut;
        }}
      >
        Log out
      </button>
    </>
  );
}
