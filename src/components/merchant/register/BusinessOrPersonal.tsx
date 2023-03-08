import { BsBuilding, BsPerson } from "react-icons/bs";

export default function BusinessOrPersonal({
  setFormData,
  formData,
  setActiveIndex,
}: any) {
  return (
    <main className=" flex min-h-screen flex-col items-center justify-start  px-8 py-16 transition-all ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Merchant</h1>
        <h2 className=" "> Become a GaMa merchant now!</h2>
      </div>
      <div className=" w-full flex flex-col gap-4 ">
      <h1>Choose your business type</h1>
      <button
        className="flex flex-row gap-4 text-xl items-center justify-center w-full rounded-xl border bg-main h-16 text-white active:bg-white active:text-black border-black transition-all no_highlights"
        onClick={() => {
          setFormData({ ...formData, type: "business" });
          setActiveIndex(2);
        }}
      ><BsBuilding className=" group-[button1] group-active:fill-black "/>
        
      <p>Business</p></button>
      <button
        className=" flex flex-row gap-4 text-xl items-center justify-center w-full rounded-xl border bg-main h-16 text-white active:bg-white active:text-black border-black transition-all no_highlights group-[button1]:"
        onClick={() => {
          setFormData({ ...formData, type: "personal" });
          setActiveIndex(2);
        }}
        
      ><BsPerson className=" group-[button1] group-active:fill-black "/>
        
        <p>Personal</p></button>
      </div>
     
    </main>
  );
}
