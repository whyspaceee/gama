import {
  BsChat,
  BsHouseDoor,
  BsPerson,
  BsShop,
  BsWallet2,
} from "react-icons/bs";

export default function BottomBar() {
  return ( 
    <nav className=" fixed bottom-0 px-2   z-10 h-16 w-full bg-black shadow-xl " style={{boxShadow: "0px 0px 18px rgba(0, 0, 0, 0.25)"}}>
      <div className=" flex h-full flex-row items-center justify-between px-4">
        <div className=" flex w-[28%]  flex-row items-center  justify-between">
          <BsHouseDoor className=" h-5 w-5 fill-white"  />
          <BsWallet2 className=" h-5 w-5 fill-white" />
        </div>

        <div className=" relative bottom-4 flex h-16 w-16 flex-row items-center justify-center rounded-full bg-white  shadow-xl " style={{boxShadow: "0px 0px 18px rgba(0, 0, 0, 0.25)"}}>
          <BsShop className=" h-6 w-6 fill-black" />
        </div>

        <div className=" flex w-[28%] flex-row items-center justify-between">
          <BsChat className=" h-5 w-5 fill-white"  />
          <BsPerson className=" h-5 w-5 fill-white"  />
        </div>
      </div>
    </nav>
  );
}
