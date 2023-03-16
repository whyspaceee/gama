import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { z } from "zod";
import { api } from "../../../utils/api";
import InputField from "../../merchant/register/InputField";
import "react-phone-number-input/style.css";
import Spinner from "../../Spinner";

export default function CustomerBasicInformation({
  setFormData,
  formData,
  setActiveIndex,
  setPhoneNumber,
  phoneNumber

}: {
  setFormData: (data: {
    name: string;
    number: string;
  }) => void;
  formData:
    | {
        name: string;
        number: string;
      }
    | undefined;
  setActiveIndex: (index: number) => void;
  setPhoneNumber: (number: string) => void;
  phoneNumber: string | undefined;
}) {

  const { mutate, isLoading } = api.verification.startVerification.useMutation({
    onSuccess: () => {
      setActiveIndex(1);
    },
  });

  const validationSchema = z.object({
    name: z.string().min(3, { message: "Must be 3 characters" }).max(32),
  });


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });

  const onSubmit = (data: any) => {
    if(phoneNumber === undefined) return;
    console.log(phoneNumber)
    setFormData({ ...formData, ...data });
    mutate({ phoneNumber: phoneNumber });
  };

  if(isLoading) {
    return <div className="w-full flex flex-col justify-center items-center h-screen" >
        <Spinner />
    </div>
  }

  return (
    <main className=" flex min-h-screen flex-col items-center justify-between  px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Madhang</h1>
      </div>
      <form
        id="basic-information"
        className=" flex h-full w-full flex-col items-center gap-y-4  "
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className=" text-center text-xl font-bold">
          Please fill in your basic information
        </p>
        <InputField
          register={register}
          errors={errors}
          name="name"
          label="Name"
        />
        <div className=" flex w-full flex-col gap-y-2">
          <label className=" w-full text-left font-bold capitalize">
            Phone Number
          </label>
          <PhoneInputWithCountrySelect
            style={{
              width: "100%",
              height: "3rem",
              border: "1px solid #ccc",
              padding: "0 10px",
              fontSize: "16px",
              boxSizing: "border-box",
              outline: "none",
              transition: "border-color 0.3s ease",
              backgroundColor: "rgb(249 250 251)",
              borderRadius: "0.75rem",
              ":focus": {
                borderColor: "#0074d9",
              },
            }}
            className="h-14 w-full rounded-xl border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-main"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e?.toString() || "")}
            defaultCountry="ID"
          />
        </div>
      </form>
      <button
        className=" mt-16  h-14 w-full rounded-xl bg-main text-lg font-bold text-white"
        type="submit"
        form="basic-information"
      >
        Continue
      </button>
    </main>
  );
}
