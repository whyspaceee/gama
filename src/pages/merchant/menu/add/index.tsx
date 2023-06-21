import { getServerSession } from "next-auth/next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdArrowRoundBack } from "react-icons/io";
import InputField from "../../../../components/InputField";
import Spinner from "../../../../components/Spinner";
import { authOptions } from "../../../../server/auth";
import { api } from "../../../../utils/api";
import CreatableSelect from "react-select/creatable";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsImage, BsPerson } from "react-icons/bs";
import { UploadButton } from "../../../../utils/uploadcomponents";

export default function AddMenu() {
  const router = useRouter();
  const utils = api.useContext();
  const { data, isLoading, error } = api.merchant.getCurrentMerchant.useQuery();
  const createCategory = api.merchant.createCategory.useMutation({
    onSettled: async (value) => {
      await utils.merchant.getCurrentMerchant.invalidate();
      if (value) {
        setValue("category", { value: value, label: value.title });
      }
    },
  });
  const addMenu = api.merchant.addMenu.useMutation({
    onSuccess: () => {
      router.push("/merchant/menu");
    },
  });

  const validationSchema = z.object({
    title: z.string().min(1, { message: "Required" }).max(50),
    description: z.string().min(1, { message: "Required" }).max(100),
    price: z.number().min(1, { message: "Required" }).max(10000000),
    stock: z.number().min(1, { message: "Required" }).max(100000),
    category: z.object({
      value: z.object({
        id: z.string(),
        title: z.string(),
        establishmentId: z.string(),
      }),
      label: z.string(),
    }),
    thumbnail: z.string(),
  });

  const onSubmit = (formData: any) => {
    if(addMenu.isLoading) return;
    if (data?.merchant?.establishments?.[0]?.id)
      addMenu.mutate({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        categoryId: formData.category.value.id,
        establishmentId: data?.merchant?.establishments?.[0]?.id,
        thumbnail: formData.thumbnail,
      });
  };

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({ resolver: zodResolver(validationSchema) });

  const [test, setTest] = useState<File | undefined>();

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  if (error) return <div>{error.message}</div>;

  return (
    <main className="mb-8 flex min-h-screen flex-col">
      <div className=" inline-flex h-16 w-full items-center justify-center bg-main p-4 text-white">
        <IoMdArrowRoundBack
          onClick={() => router.push("/merchant/menu")}
          className=" absolute left-4 h-5 w-5 "
        />
        <h1 className="overflow-hidden truncate text-lg font-bold">Add Item</h1>
      </div>
      <div className=" flex flex-col gap-1 p-4  shadow-xl">
        <div>
          {watch("thumbnail") ? (
            <Image
              src={watch("thumbnail")}
              alt="thumbnail"
              width={100}
              height={100}
              className=" aspect-square rounded-xl object-cover"
            />
          ) : (
            <BsImage className=" h-[100px] w-[100px] rounded-xl bg-gray-200 fill-gray-500 p-4" />
          )}
        </div>

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            if(!res) return
            setValue("thumbnail", res[0]?.fileUrl);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />

        <p className=" text-sm font-bold">
          Items with high quality photos tend to be more appealing to customers.
          Max 2MB.
        </p>
      </div>
      <form
        id="add-item"
        className=" mb-4 flex flex-col gap-4 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          register={register}
          errors={errors}
          name="title"
          label="Item Name"
        />
        <InputField
          register={register}
          errors={errors}
          name="description"
          label="Description"
        />
        <InputField
          register={register}
          errors={errors}
          name="price"
          label="Price"
          number
        />
        <InputField
          register={register}
          errors={errors}
          name="stock"
          label="Stock"
          number
        />
        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className=" flex w-full flex-col gap-2">
              <p className=" font-bold">Category</p>
              <CreatableSelect
                options={data?.merchant?.establishments?.[0]?.categories.map(
                  (category) => ({
                    value: category,
                    label: category.title,
                  })
                )}
                {...field}
                onChange={(value) => field.onChange(value)}
                isSearchable
                isClearable
                onCreateOption={(inputValue) => {
                  if (data?.merchant?.establishments?.[0]?.id) {
                    createCategory.mutate({
                      title: inputValue,
                      establishmentId: data?.merchant?.establishments?.[0]?.id,
                    });
                  }
                }}
                isLoading={isLoading}
                isDisabled={isLoading}
                className=" w-full"
              />
            </div>
          )}
        />
      </form>
      <button
        form="add-item"
        className=" mx-4 mt-8  h-14  rounded-xl bg-main text-lg font-bold text-white"
        type="submit"
      >
        Add Item
      </button>
    </main>
  );
}

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  session?.user;

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/merchant/menu",
        permanent: false,
      },
    };
  }

  if (!session.user.merchantId) {
    return {
      redirect: {
        destination: "/merchant/register",
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
