export default function UnfocusedScreen() {
  return (
    <div className=" flex flex-col gap-4">
      <div className=" flex flex-col gap-2">
          <h1 className=" text-xl">Recent Searches</h1>
          <div className=" flex flex-row flex-wrap gap-2 text-main ">
            <div className=" rounded-full border-main px-4 py-1 border ">Nasi Padang</div>
            <div className=" rounded-full border-main px-4 py-1 border ">McD</div>
            <div className=" rounded-full border-main px-4 py-1 border ">KFC</div>
            <div className=" rounded-full border-main px-4 py-1 border ">Pizza Hut</div>
          </div>
      </div>
      <h1 className=" text-xl ">Top Rated Foods</h1>
      <div className=" flex flex-col gap-2">
          <h1 className=" text-xl">People's Favorites</h1>
          <div className=" flex flex-row flex-wrap gap-2 text-main ">
            <div className=" rounded-full border-main px-4 py-1 border ">Nasi Padang</div>
            <div className=" rounded-full border-main px-4 py-1 border ">McD</div>
            <div className=" rounded-full border-main px-4 py-1 border ">KFC</div>
            <div className=" rounded-full border-main px-4 py-1 border ">Pizza Hut</div>
          </div>
      </div>
      <div className=" flex flex-col gap-2">
          <h1 className=" text-xl">Explore by tags</h1>
          <div className=" flex flex-row flex-wrap gap-2 text-main ">
            <div className=" rounded-full border-main px-4 py-1 border ">Low Calories</div>
            <div className=" rounded-full border-main px-4 py-1 border ">High Calories</div>
            <div className=" rounded-full border-main px-4 py-1 border ">Halal</div>
            <div className=" rounded-full border-main px-4 py-1 border ">Keto Friendly</div>
          </div>
      </div>
    </div>
  );
}
