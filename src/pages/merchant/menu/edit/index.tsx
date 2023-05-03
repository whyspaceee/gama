import { getServerSession } from "next-auth/next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
import { IoTrashBin } from "react-icons/io5";

export default function EditMenu() {
  const router = useRouter();
  const utils = api.useContext();
  const { data, isLoading, error } = api.merchant.getCurrentMerchant.useQuery();
  const menuItem = data?.merchant?.establishments?.[0]?.menu.find(
    (item) => item.id === router.query.id
  );
  const createCategory = api.merchant.createCategory.useMutation({
    onSettled: async (value) => {
      await utils.merchant.getCurrentMerchant.invalidate();
      if (value) {
        setValue("category", { value: value, label: value.title });
      }
    },
  });
  const editMenu = api.merchant.editMenu.useMutation({
    onSuccess: () => {
      router.push('/merchant/menu')
    }})

  useEffect(() => {
    if(!menuItem) return
    reset({
      title: menuItem?.title,
      description: menuItem?.description,
      price: menuItem?.price,
      stock: menuItem?.stock,
      category: { value: menuItem?.category, label: menuItem?.category.title },

    })
  }, [menuItem])



  const validationSchema = z.object({
    title: z.string().min(1, {message: 'Required'}).max(50),
    description: z.string().min(1, {message: 'Required'}).max(100),
    price: z.number().min(1, {message: 'Required'}).max(10000000),
    stock: z.number().min(1, {message: 'Required'}).max(100000),
    category: z.object({
      value: z.object({
        id: z.string(),
        title: z.string(),
        establishmentId: z.string(),
      }),
      label: z.string(),
    }),
  });

  const onSubmit = (data:any) => {
    console.log(data)
    if(menuItem){
    editMenu.mutate({
      id: menuItem.id,
      title: data.title,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.category.value.id,
    })
    }
  };

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    reset
  } = useForm({resolver: zodResolver(validationSchema)});

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  if (error) return <div>{error.message}</div>;

  if (menuItem){
    return (
      <main className="mb-8 flex min-h-screen flex-col">
        <div className=" inline-flex h-16 w-full items-center justify-between bg-main p-4 text-white">
          <IoMdArrowRoundBack
            onClick={() => router.push('/merchant/menu')}
            className=" h-5 w-5 "
          />
          <h1 className="overflow-hidden truncate text-lg font-bold">
            Edit {menuItem.title}
          </h1>
          <IoTrashBin
            onClick={() => router.push('/merchant/menu')}
            className=" h-5 w-5 "
          />
        </div>
        <div className=" flex flex-col gap-1 p-4  shadow-xl">
          <Image
            src={menuItem.thumbnail}
            alt={"thumbnail"}
            width={100}
            height={100}
            className=" aspect-square rounded-xl object-cover"
          />
          <p className=" text-sm font-bold text-sky-500">Change photo</p>
          <p className=" text-sm font-bold">
            Items with high quality photos tend to be more appealing to
            customers. Max 2MB.
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
                        establishmentId:
                          data?.merchant?.establishments?.[0]?.id,
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
            Edit Item
          </button>
      </main>
    );}
}

export async function getServerSideProps(context: { req: any; res: any }) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log(session?.user);

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
