import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../utils/api";
import InputField from "./InputField";

export default function BasicInformation({ setFormData, formData }: any) {
    const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  
  const validationSchema = z.object({
    title: z.string().min(3, { message: "Must be 3 characters" }).max(32),
    address: z.string().min(2, { message: "Must be 2 characters" }).max(32),
    number: z.string().regex(phoneRegExp, { message: "Invalid phone number" }),
  });

  const {mutate} = api.merchant.register.useMutation()


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });

  const onSubmit = (data: any) => {
    mutate(data)
    console.log(data);
  };

  return (
    <main className=" flex min-h-screen flex-col items-center justify-between  px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Merchant</h1>
        <h2 className=" "> Become a GaMa merchant now!</h2>
      </div>
      <form
        id="basic-information"
        className=" flex w-full flex-col items-center gap-y-4 h-full  "
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className=" text-xl font-bold text-center">Please fill in your basic information</p>
        <InputField register={register} errors={errors} name="title" />
        <InputField register={register} errors={errors} name="address" />
        <InputField register={register} errors={errors} name="number" />

      </form>
      <button
          className=" mt-16  h-14 w-full rounded-xl bg-indigo-400 text-lg font-bold text-white"
          type="submit"
          form="basic-information"
        >
          Continue
        </button>
    </main>
  );
}
