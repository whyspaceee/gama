import { Category, MenuItem } from "@prisma/client";
import { useRouter } from "next/router";
import { BsPlus } from "react-icons/bs";
import CustomerMenuItem from "./CustomerMenuItem";

export default function CustomerMenuList({ menu, categories }: { menu: MenuItem[], categories: Category[] }) {
    
    const categorizedMenu = categories.map((category) => {
        return {
            category,
            items: menu.filter((item) => item.categoryId === category.id)
        }
    })

    return (
    <div className=" flex flex-col gap-4 px-4 pb-16">
      {menu.map((item) => (
        <CustomerMenuItem item={item} key={item.id} />
      ))}
    </div>
  );
}
