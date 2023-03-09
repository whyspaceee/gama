import { SetStateAction, useEffect, useState } from "react";
import OtpInput from "react18-input-otp";
import { api } from "../../../utils/api";

export default function OTP({
  setFormData,
  formData,
  number,
  setActiveIndex,
}: {
  setFormData: (data: {
    title: string;
    address: string;
    number: string;
  }) => void;
  number: string;
  formData:
    | {
        title: string;
        address: string;
        number: string;
      }
    | undefined;

  setActiveIndex: (index: number) => void;
}) {
  const { mutate } = api.driver.verifyPhone.useMutation({
    onSuccess: (data) => {
      setOtp("");
      if (data.status == "SUCCESS") {
        setFormData({ ...formData!, number: number });
        setActiveIndex(2);
      }
    },
  });

  const [otp, setOtp] = useState("");
  const handleChange = (enteredOtp: SetStateAction<string>) => {
    setOtp(enteredOtp);
  };

  useEffect(() => {
    console.log(otp);
    if (otp.length === 6) {
      if (number) {
        mutate({ phoneNumber: number, code: otp });
      }
    }
  }, [otp]);

  return (
    <main className=" flex min-h-screen flex-col justify-between items-center px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold text-red-500">Gas! Driver</h1>
        <h2 className=" "> Become a GaMa driver now!</h2>
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
