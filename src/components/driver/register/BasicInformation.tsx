import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { z } from "zod";
import { api } from "../../../utils/api";
import InputField from "../../merchant/register/InputField";
import "react-phone-number-input/style.css";

export type InputProps = {
  register: UseFormRegister<FieldValues>;
  errors: any;
  name: string;
  label: string;
};

export default function DriverBasicInformation({
  setFormData,
  formData,
  setActiveIndex,
  setPhoneNumber,
  phoneNumber

}: {
  setFormData: (data: {
    title: string;
    address: string;
    number: string;
  }) => void;
  formData:
    | {
        title: string;
        address: string;
        number: string;
      }
    | undefined;
  setActiveIndex: (index: number) => void;
  setPhoneNumber: (number: string) => void;
  phoneNumber: string | undefined;
}) {
  const { mutate } = api.driver.startVerification.useMutation({
    onSuccess: () => {
      setActiveIndex(1);
    },
  });

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = z.object({
    title: z.string().min(3, { message: "Must be 3 characters" }).max(32),
    address: z.string().min(2, { message: "Must be 2 characters" }).max(32),
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

  return (
    <main className=" flex min-h-screen flex-col items-center justify-between  px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Driver</h1>
        <h2 className=" "> Become a GaMa driver now!</h2>
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
          name="title"
          label="Driver Name"
        />
        <InputField
          register={register}
          errors={errors}
          name="address"
          label="address"
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
