import { zodResolver } from "@hookform/resolvers/zod";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { SearchBox } from "@mapbox/search-js-react";
import {
  MutableRefObject,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { Map, MapRef } from "react-map-gl";
import { z } from "zod";
import { env } from "../../../env.mjs";
import { api } from "../../../utils/api";
import SelectForwardGeocoder from "../../geocoder/ForwardGeocoder" 
import InputField from "./InputField";

export type InputProps = {
  register: UseFormRegister<FieldValues>;
  errors: any;
  name: string;
  label: string;
};

export default function MerchantBasicInformation({
  setFormData,
  formData,
  setActiveIndex,
}: any) {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = z.object({
    title: z.string().min(3, { message: "Must be 3 characters" }).max(32),
    address: z.object({ label: z.string() , value: z.object({
      id: z.string(),
      type: z.string(),
      place_name: z.string(),
      center: z.array(z.number()),
      text: z.string(),
    }) }),
    number: z.string().regex(phoneRegExp, { message: "Invalid phone number" }),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
    }
    );
  },[])


  const onSubmit = (data: any) => {
    console.log(data)
    setFormData({ ...formData, ...data });
    setActiveIndex(1);
  };

  type Position = {
    longitude?: number;
    latitude?: number;
  };

  const [position, setPosition] = useState<Position>({});
  const { data, isLoading } = api.geocoding.reverseGeocode.useQuery(
    { lng: position.longitude!, lat: position.latitude! },
    { enabled: !!position.longitude && !!position.latitude }
  );


  const mapRef = useRef<MapRef>();

  return (
    <main className=" flex min-h-screen flex-col items-center justify-between  px-8 py-16 ">
      <div className=" mb-8">
        <h1 className=" text-4xl font-bold">Gas! Merchant</h1>
        <h2 className=" "> Become a GaMa merchant now!</h2>
      </div>
      <form
        id="basic-information"
        className=" flex h-full w-full flex-col items-center gap-y-4  "
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className=" text-center text-xl font-bold">
          Please fill in your basic information
        </p>
        <InputField
          register={register}
          errors={errors}
          name="title"
          label="Merchant Name"
        />
        <InputField
          register={register}
          errors={errors}
          name="number"
          label="number"
        />
        <Controller
          name="address"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <SelectForwardGeocoder
              mapRef={mapRef}
              {...field}
              onChange={(e) => {
                if (e?.value.center) {
                  mapRef.current?.setCenter([e.value.center[0]!, e.value.center[1]!]);
                }
                field.onChange(e);
                console.log(e)
              }}
            />
          )}
        />
        <div className="mt-4 overflow-hidden rounded-xl w-full relative bg-red">
          <Map
            ref={mapRef as MutableRefObject<MapRef>}
            attributionControl={false}
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={{
              longitude: 110.376352,
              latitude: -7.771081,
              zoom: 15,
            }}
            style={{
              position: "relative",
              width: "100%",
              height: "192px",
            }}
                     
            mapStyle="mapbox://styles/mapbox/streets-v12"
          ></Map>
        </div>
        <button
        onClick={() => {
          setValue("address", {
            label: data?.at(0)?.place_name,
            value: data?.at(0),
          });
        }}
         type="button">
          
          <p className=" text-center text-xl font-bold">
            Use Current Location
          </p>
          {isLoading && <p>Loading...</p>}
          {data && (
            <p>
              {data[0]?.place_name} {data[0]?.center[0]}{" "}
              {data[0]?.center[1]}
            </p>
          )}
        </button>
      </form>
      <button
        className=" mt-16  h-14 w-full rounded-xl bg-main text-lg font-bold text-white"
        type="submit"
        form="basic-information"
        onClick={() => {
          if(data){
          setValue("address", {
            label: data[0]?.place_name,
            value: data[0],
          })};
        }}
      >
        Continue
      </button>
    </main>
  );
}
