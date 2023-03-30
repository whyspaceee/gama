import Head from "next/head";
import { useEffect, useState } from "react";
import BasicInformation from "../../../components/merchant/register/BasicInformation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import BusinessOrPersonal from "../../../components/merchant/register/BusinessOrPersonal";
import BusinessInformation from "../../../components/merchant/register/BusinessInformation";
import PersonalInformation from "../../../components/merchant/register/PersonalInformation";



export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  (session?.user)

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/merchant",
        permanent: false,
      },
    };
  }

  if(session.user.merchantId ){
    return {
      redirect: {
        destination: "/merchant",
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
  const [formData, setFormData] = useState({
    type:''
  });
  const [activeIndex, setActiveIndex] = useState(0);




  return (
    <>
      <Head>
        <title>Register Data</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" ref="/favicon.ico" />
      </Head>
      {
        {
            0: <BasicInformation setFormData={setFormData} formData={formData} setActiveIndex={setActiveIndex} />,
            1: <BusinessOrPersonal setFormData={setFormData} formData={formData} setActiveIndex={setActiveIndex}/>,
            2: formData.type === "business" ? <BusinessInformation setFormData={setFormData} formData={formData} /> : <PersonalInformation setFormData={setFormData} formData={formData}/>
        }[activeIndex]
      }
    </>
  );
}
