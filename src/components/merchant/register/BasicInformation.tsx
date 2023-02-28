import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";

export default function BasicInformation({ setFormData, formData }: any) {
    const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  
  const validationSchema = z.object({
    name: z.string().min(3, { message: "Must be 3 characters" }).max(20),
    address: z.string().min(2, { message: "Must be 2 characters" }).max(20),
    phone: z.string().regex(phoneRegExp, { message: "Invalid phone number" }),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Merchant</h1>
        <h2 className=" "> Become a GaMa merchant now!</h2>
      </div>
      <form
        className=" flex w-full flex-col items-center gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className=" text-xl font-bold">Basic Information</p>
        <InputField register={register} errors={errors} name="name" />
        <InputField register={register} errors={errors} name="address" />
        <InputField register={register} errors={errors} name="phone" />

        <button
          className=" mt-16  h-14 w-full rounded-xl bg-indigo-400 text-lg font-bold text-white"
          type="submit"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
