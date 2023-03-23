import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../utils/api";
import InputField from "../../InputField";

export type InputProps = {
  register: UseFormRegister<FieldValues>;
  errors: any;
  name: string;
  label: string;
};

export default function DriverDetails({
  setFormData,
  formData,
  setActiveIndex,
}: {
  setFormData: (data: {
    title: string;
    address: string;
    number: string;
  }) => void;
  formData: {
    title: string;
    address: string;
    number: string;
  } | undefined;
  setActiveIndex: (index: number) => void;
}) {

  const router = useRouter();

  const { mutate } = api.driver.driverRegister.useMutation({
    onSuccess: () => {
      router.push("/driver");
    },
  })
  
  const validationSchema = z.object({
    nik: z.string().min(3, { message: "Must be 3 characters" }).max(32 , { message: "Must be 32 characters" }),
    sim: z.string().min(2, { message: "Must be 2 characters" }).max(32, { message: "Must be 32 characters" }),
    stnk: z.string().min(2, { message: "Must be 2 characters" }).max(32, { message: "Must be 32 characters" }),
    vehicle: z.string().min(2, { message: "Must be 2 characters" }).max(32, { message: "Must be 32 characters" }),
    bankNumber: z.string().min(2, { message: "Must be 2 characters" }).max(32, { message: "Must be 32 characters" }),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });

  const onSubmit = (data: any) => {
    mutate({ ...formData, ...data });
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
          name="nik"
          label="NIK"
        />
        <InputField
          register={register}
          errors={errors}
          name="sim"
          label="SIM Number"
        />
        <InputField
          register={register}
          errors={errors}
          name="stnk"
          label="STNK"
        />
        <InputField
          register={register}
          errors={errors}
          name="vehicle"
          label="Vehicle Type"
        />
        <InputField
          register={register}
          errors={errors}
          name="bankNumber"
          label="Bank Number"
        />
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
