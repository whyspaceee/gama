import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../utils/api";
import InputField from "./InputField";

export default function PersonalInformation({ setFormData, formData, setActiveIndex }: any) {  

  
  const validationSchema = z.object({
    nik: z.string().min(3, { message: "Must be 3 characters" }).max(32),
    bankNumber: z.string().min(2, { message: "Must be 2 characters" }).max(32),
    taxId: z.string().min(2, { message: "Must be 2 characters" }).max(32),
  });
  
  const { mutate } = api.merchant.registerPersonal.useMutation({onSuccess: () => {router.push('/merchant')}});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });


  const onSubmit = (data: any) => {
    const finalData = {...formData, personalData: data}
    mutate(finalData)
  };

  return (
    <main className=" flex min-h-screen flex-col items-center justify-between  px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Merchant</h1>
        <h2 className=" "> Become a GaMa merchant now!</h2>
      </div>
      <form
        id="business-information"
        className=" flex w-full flex-col items-center gap-y-4 h-full  "
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className=" text-xl font-bold text-center">Please fill in your business information</p>
        <InputField register={register} errors={errors} name="nik" label='ID Number (NIK)'/>
        <InputField register={register} errors={errors} name="bankNumber" label='Bank Number (Rekening)'/>
        <InputField register={register} errors={errors} name="taxId" label='Tax ID (NPWP)'/>
      </form>
      <button
          className=" mt-16  h-14 w-full rounded-xl bg-main text-lg font-bold text-white"
          type="submit"
          form="business-information"
        >
          Submit
        </button>
    </main>
  );
}
