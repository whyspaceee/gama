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

  if (!session) {
    return {
      redirect: {
        destination: "/login",
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
    return(
        <Register/>
    )

}
