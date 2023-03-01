import Link from "next/link";
import { IconType } from "react-icons/lib";
import { MdRestaurantMenu } from "react-icons/md";

export default function IconButton({
  Icon,
  label,
}: {
  Icon: IconType;
  label: string;
}) {
  return (
    <Link href='/merchant'>
    <div className=" flex flex-col items-center gap-1">
      <div className=" flex h-14 w-14  min-w-max items-center justify-center rounded-lg border">
        <Icon className=" h-8 w-8" />
      </div>
    <p className=" text-center text-sm font-medium">{label}</p>
    </div>
    </Link>
  );
}
