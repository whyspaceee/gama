
export default function BusinessOrPersonal({
  setFormData,
  formData,
  setActiveIndex,
}: any) {
  return (
    <main className=" flex w-full flex-col gap-4 p-8">
      <h1>Choose your business type</h1>
      <button
        className=" w-full rounded-xl border border-gray-300 h-16"
        onClick={() => {
          setFormData({ ...formData, type: "business" });
          setActiveIndex(2);
        }}
      >Business</button>
      <button
        className=" w-full rounded-xl border border-gray-3ss00 h-16"
        onClick={() => {
          setFormData({ ...formData, type: "personal" });
          setActiveIndex(2);
        }}
        
      >Personal</button>
    </main>
  );
}
