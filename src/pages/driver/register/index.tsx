import { getServerSession } from "next-auth";
import Head from "next/head";
import { useState } from "react";
import DriverBasicInformation from "../../../components/driver/register/BasicInformation";
import Prepare from "../../../components/driver/register/prepare";
import BasicInformation from "../../../components/merchant/register/BasicInformation";
import { authOptions, getServerAuthSession } from "../../../server/auth";

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/driver",
        permanent: false,
      },
    };
  }

  if (session.user.driverId) {
    return {
      redirect: {
        destination: "/driver",
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

export default function Register() {
  const [formData, setFormData] = useState<{
    title: string;
    address: string;
    number: string;
  }>();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" ref="/favicon.ico" />
      </Head>
      {
        {
          0: (
            <DriverBasicInformation
              setFormData={setFormData}
              formData={formData}
              setActiveIndex={setActiveIndex}
            />
          ),
          1: <Prepare setActiveIndex={setActiveIndex} />,
        }[activeIndex]
      }
    </>
  );
}
