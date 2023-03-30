import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import OtpInput from "react18-input-otp";
import { api } from "../../../utils/api";
import Spinner from "../../Spinner";

export default function OTP({
  setFormData,
  formData,
  number,
  setActiveIndex,
}: {
  setFormData: (data: {
    name: string;
    number: string;
  }) => void;
  number: string;
  formData:
    | {
        name: string;
        number: string;
      }
    | undefined;

  setActiveIndex: (index: number) => void;
}) {

  const router = useRouter()
  
  const register = api.customer.customerRegister.useMutation({
    onSuccess: (data) => {
      if (data.customerId) {
        router.push("/customer");
      }
    },
  }
  );

  const { mutate, isLoading } = api.verification.verifyPhoneNumber.useMutation({
    onSuccess: (data) => {
      setOtp("");
      if (data.status == "SUCCESS") {
        setFormData({ ...formData!, number: number });
        register.mutate({ name: formData?.name!, number: number });
      }
    },
  });

  const [otp, setOtp] = useState("");
  const handleChange = (enteredOtp: SetStateAction<string>) => {
    setOtp(enteredOtp);
  };

  useEffect(() => {
    (otp);
    if (otp.length === 6) {
      if (number) {
        mutate({ phoneNumber: number, code: otp });
      }
    }
  }, [otp]);

  if(isLoading) {
    return <div className="w-full flex flex-col justify-center items-center h-screen" >
        <Spinner />
    </div>
  }

  return (
    <main className=" flex min-h-screen flex-col justify-between items-center px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold text-red-500">Gas! Madhang</h1>
      </div>
      <div className=" p-6 flex flex-col items-center bg-white shadow-lg rounded-xl">
        <h1 className=" text-center text-xl font-bold">
          Enter the code sent to {number}
        </h1>
        <OtpInput
          className="mt-8 text-3xl   "
          value={otp}
          onChange={handleChange}
          numInputs={6}
          separator={<span>-</span>}
        />
      </div>
      <button  className=" inline-flex h-14 w-full items-center justify-center rounded-md border bg-red-600 py-3.5 text-xl font-bold text-white">
          Resend Code
        </button>
    </main>
  );
}
