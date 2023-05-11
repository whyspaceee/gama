import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@trpc/server";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { BsPerson } from "react-icons/bs";
import { FaArrowLeft, FaPersonBooth } from "react-icons/fa";
import { z } from "zod";
import { api } from "../../../utils/api";

export default function TransferPage() {
  const validationSchema = z.object({
    to: z
      .number()
      .min(10000000, { message: "8 Digits" })
      .max(99999999, { message: "8 Digits" }),
    amount: z.number().min(1, { message: "Required" }).max(10000000),
  });

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
  });
  
  const router = useRouter()

  const {
    data,
    isLoading,
    error: queryError,
  } = api.wallet.getUserFromWalletId.useQuery(
    {
      id: watch("to")?.toString(),
    },
    {
      enabled: watch("to")?.toString().length === 8,
      retry: false,
    }
  );

  const { mutate } = api.wallet.transferWallet.useMutation(
    {
      onSuccess: () => {
        router.push("/wallet");
      }
    }
  );

  function submit(data: any) {
    const stringData = {
      ...data,
      to: data.to.toString(),
    }
    mutate(stringData);
  }

  return (
    <main className=" flex min-h-screen flex-col justify-between ">
      <form
        id="transfer-form"
        onSubmit={handleSubmit(submit)}
        className="mx-6 flex flex-col gap-2"
      >
                <FaArrowLeft className="h-8 mt-6" onClick={() => router.back()} />

        <h1 className="my-6 text-3xl font-bold">Transfer</h1>

        <label htmlFor="to">Account Number</label>
        <input
          id="to"
          type="number"
          onInput={(e) =>
            (e.currentTarget.value = e.currentTarget.value.slice(0, 8))
          }
          max={99999999}
          {...register("to", { valueAsNumber: true })}
          className="rounded-lg border border-neutral-300 px-4 py-2 outline-none"
        />
        {errors.to && (
          <p className=" text-sm text-main">{errors.to.message?.toString()}</p>
        )}
        {queryError && <p className=" text-sm text-main">User not found</p>}
        {data && (
          <div className="inline-flex items-center gap-3">
            {data.user.image ? (
              <Image
                src={data.user.image}
                width={48}
                height={48}
                alt="tb"
                className="rounded-full"
              />
            ) : (
              <div className="aspect-square w-12 h-12 rounded-full bg-neutral-300 flex items-center justify-center">
                <BsPerson className="text-3xl text-neutral-500" />
              </div>
            )}
            <p className="text-lg">{data.user.name}</p>
          </div>
        )}

        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          disabled={!!!data}
          {...register("amount", { valueAsNumber: true })}
          className="rounded-lg border border-neutral-300 px-4 py-2 outline-none"
        />
        {errors.amount && (
          <p className=" text-sm text-main">
            {errors.amount.message?.toString()}
          </p>
        )}
      </form>
      <button
        type="submit"
        form="transfer-form"
        className="mx-6 my-4 rounded-lg bg-main px-4 py-2 text-white"
      >
        Submit
      </button>
    </main>
  );
}
