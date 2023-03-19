import { on } from "events";
import { useEffect, useState } from "react";
import Select from "react-select";
import useDebounce from "../../hooks/useDebounce";
import { api } from "../../utils/api";

export default function SelectForwardGeocoder() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce<string>(searchValue, 500)
  
  useEffect(() => {
    mutate({ address: debouncedValue, limit: 5  })
  }, [debouncedValue])

  
  const { mutate, data, isLoading } = api.geocoding.forwardGeocode.useMutation({
    onSuccess: (res) => {
      return res.map((e) => {
        return {
          placeName: e.place_name, 
        };
      });
    },
  });

  return (
    <Select
      options={data?.map((e) => {
        return {
          value: e,
          label: e.place_name,
        };
        })
      }
      onInputChange={(e) => {
        setSearchValue(e);
      }}
      inputValue={searchValue}
      isSearchable
      isLoading={isLoading}
      className=" w-full"
    />

  );
}
