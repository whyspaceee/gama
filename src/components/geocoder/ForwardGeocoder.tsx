import { on } from "events";
import { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import Select from "react-select";
import useDebounce from "../../hooks/useDebounce";
import { api } from "../../utils/api";

export default function SelectForwardGeocoder({
  mapRef,
  onChange
}: {
  mapRef: React.MutableRefObject<MapRef | undefined>;
  onChange: (e: any) => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce<string>(searchValue, 200);

  useEffect(() => {
    mutate({ address: debouncedValue, limit: 5 });
  }, [debouncedValue]);

  const { mutate, data, isLoading } = api.geocoding.forwardGeocode.useMutation(
    {}
  );

  return (
    <div className=" flex flex-col gap-2 w-full">
      <p className=" font-bold">Address</p>
    <Select
      options={data?.map((e) => {
        return {
          value: e,
          label: e.place_name,
        };
      })}
      onInputChange={(e) => {
        setSearchValue(e);
      }}
      onChange={onChange}
      inputValue={searchValue}
      isSearchable
      isClearable
      isLoading={isLoading}
      className=" w-full"
    />
    </div>
  );
}
