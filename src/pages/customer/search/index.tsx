import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import FocusedScreen from "../../../components/customer/search/FocusedScreen";
import UnfocusedScreen from "../../../components/customer/search/UnfocusedScreen";
import Spinner from "../../../components/Spinner";
import useDebounce from "../../../hooks/useDebounce";
import { api } from "../../../utils/api";


export default function SearchPage() {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const setFocused = () => setIsFocused(true);
  const setBlur = () => setIsFocused(false);

  const [position, setPosition] = useState<GeolocationPosition>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition(position);
    });
  }, []);


  useEffect(() => {
    (isFocused);
  }, [isFocused]);

  const { data, isLoading, } = api.customer.searchEstablishmentAndMenus.useQuery({
    search:  debouncedSearch,
    location: {
        lat: position?.coords.latitude!,
        lng: position?.coords.longitude!,
    },
    }, {
        enabled: !!debouncedSearch && !!position
  })
  

  return (
    
    <main className=" flex min-h-screen flex-col">
      <div className="h-28 w-full bg-main py-6 px-8 font-semibold">
        <div className=" flex h-full flex-col justify-between">
          <div>
            <div className=" flex flex-row items-center gap-2">
              <FaMapMarkerAlt className=" fill-white" />
              <p className=" font-medium text-white">Your location</p>
            </div>
          </div>
          <div>
            <BsSearch className=" absolute top-16 left-12" />
            <input
              placeholder="Madhang apa hari ini?"
              onFocus={setFocused}
              onBlur={setBlur}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              className=" w-full rounded-full bg-white px-12 py-1 "
            />
          </div>
        </div>
      </div>
      <div className=" px-8 py-6">
      {data ? <FocusedScreen data={data}  /> : <UnfocusedScreen />}
      </div>
    </main>
  );
}
