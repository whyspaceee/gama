import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { api } from "../../../utils/api";
import { useForm } from "react-hook-form";

export default function TopupScreen() {

  const router = useRouter()
  const { mutate } = api.wallet.topUp.useMutation({
    onSuccess: (data) => {
        router.back()
    }
  })

  const { register, handleSubmit } = useForm()
  

  return (
    <main className=" relative flex flex-col ">
      <div className=" h-25 flex w-full flex-col justify-between gap-1 bg-main px-6 py-4 text-white">
        <FaArrowLeft className="h-8" onClick={() => router.back()} />
        <h1 className=" text-3xl font-medium">Top up</h1>
      </div>

      <form className=" px-6 py-4 " onSubmit={handleSubmit((e) => {
        mutate({
          amount: parseInt(e.amount)
        })
      })}>
        <input {...register('amount', {
            required: true,
        })} type="number" placeholder="Amount" required className=" w-full py-2 px-4 border rounded-lg" />
        <button type="submit" className=" rounded-lg bg-main px-4 py-2 text-white font-medium mt-4 ">Top up</button>
      </form>
    </main>
  );
}
