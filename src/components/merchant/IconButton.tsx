import Link from "next/link";
import { IconType } from "react-icons/lib";
import { MdRestaurantMenu } from "react-icons/md";

export default function IconButton({
  Icon,
  label,
  delay,
  href
}: {
  Icon: IconType;
  label: string;
  delay: number;
  href?: string;
}) {
  return (
    <Link href={href!} className="no_highlights" >
    <div 
     className=" no_highlights flex flex-col items-center gap-1 hover:-translate-y-2 transition-all">
      <div className=" flex h-14 w-14  min-w-max items-center justify-center rounded-lg border active:bg-blue-100 duration-500 ">
        <Icon className=" h-8 w-8" />
      </div>
    <p className=" text-center text-sm font-medium">{label}</p>
    </div>
    </Link>
  );
}
