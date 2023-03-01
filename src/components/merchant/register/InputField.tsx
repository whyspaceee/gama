import { InputProps } from "../../../pages/merchant/register";

export default function InputField({register, errors , name} : InputProps) {
    return(
        <div className=" flex w-full flex-col gap-y-2">
            <label
              className=" w-full text-left font-bold capitalize"
              placeholder="Full name"
            >
              {name}
            </label>
            <input
              {...register(name)}
              className=" h-12 w-full rounded-xl border bg-gray-50 px-3"
            />
            {errors[name] && (
              <p className=" text-xs  text-red-500">
                {errors[name].message.toString()}
              </p>
            )}
          </div>
    )
}