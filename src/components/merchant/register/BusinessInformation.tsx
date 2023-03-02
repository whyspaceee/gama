import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../utils/api";
import InputField from "./InputField";

export default function BusinessInformation({
  setFormData,
  formData,
  setActiveIndex,
}: any) {

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = z.object({
    companyName: z.string().min(3, { message: "Must be 3 characters" }).max(32),
    officeAddress: z
      .string()
      .min(2, { message: "Must be 2 characters" })
      .max(32),
    businessIdNumber: z
      .string()
      .min(2, { message: "Must be 2 characters" })
      .max(32),
    companyEmail: z.string().email({ message: "Invalid email" }),
    officeTelephone: z
      .string()
      .regex(phoneRegExp, { message: "Invalid phone number" }),
  });

  const router = useRouter();

  const { mutate } = api.merchant.registerBusiness.useMutation({
    onSuccess: () => {
      router.push("/merchant");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });

  const onSubmit = (data: any) => {
    const finalData = { ...formData, companyData: data };
    mutate(finalData);
  };

  return (
    <main className=" flex min-h-screen flex-col items-center justify-between  px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Merchant</h1>
        <h2 className=" "> Become a GaMa merchant now!</h2>
      </div>
      <form
        id="business-information"
        className=" flex h-full w-full flex-col items-center gap-y-4  "
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className=" text-center text-xl font-bold">
          Please fill in your business information
        </p>
        <InputField
          register={register}
          errors={errors}
          name="companyName"
          label="Company Name"
        />
        <InputField
          register={register}
          errors={errors}
          name="officeAddress"
          label="Office Address"
        />
        <InputField
          register={register}
          errors={errors}
          name="businessIdNumber"
          label="Business Identification Number"
        />
        <InputField
          register={register}
          errors={errors}
          name="companyEmail"
          label="Company Email"
        />
        <InputField
          register={register}
          errors={errors}
          name="officeTelephone"
          label="Office Telephone Number"
        />
      </form>
      <button
        className=" mt-16  h-14 w-full rounded-xl bg-black text-lg font-bold text-white"
        type="submit"
        form="business-information"
      >
        Submit
      </button>
    </main>
  );
}
