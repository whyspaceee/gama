import { useRouter } from "next/router";
import { api } from "../../../../utils/api";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { Layer, Map, MapRef, Marker, Source } from "react-map-gl";
import { useEffect, useRef } from "react";
import { env } from "../../../../env.mjs";
import Spinner from "../../../../components/Spinner";
import {
  BsPinMap,
  BsTelephone,
  BsTelephoneFill,
  BsTelephonePlus,
} from "react-icons/bs";
import formatStatus from "../../../../utils/formatStatus";
import { IoMail } from "react-icons/io5";
import formatter from "../../../../utils/formatter";
import "mapbox-gl/dist/mapbox-gl.css";

export default function CustomerOrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = api.customer.orderDetailsQuery.useQuery(
    {
      orderId: id?.toString()!,
    },
    {
      enabled: !!id,
    }
  );

  if (isLoading) return <Spinner />;

  if (data)
    return (
      <main className=" relative flex min-h-screen w-full flex-col  ">
        <div className=" h-25 flex w-full flex-col justify-between bg-main px-6 py-4 text-white">
          <FaArrowLeft
            className="h-8"
            onClick={() => router.push(`/customer/establishment?id=${id}`)}
          />
          <h1 className=" text-3xl font-medium">Order</h1>
        </div>
        <Map
          attributionControl={false}
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: data.currentOrder?.establishment.address?.longitude,
            latitude: data.currentOrder?.establishment.address?.latitude,
            zoom: 12,
          }}
          style={{
            width: "100%",
            height: "50vh",
          }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <Source
            id="polylineLayer"
            type="geojson"
            data={data?.directions.routes[0]?.geometry}
          >
            <Layer
              id="lineLayer"
              type="line"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "rgba(3, 170, 238, 0.5)",
                "line-width": 5,
              }}
            />
          </Source>
        </Map>
        <div className=" relative bottom-0 flex flex-1 flex-col gap-4 overflow-hidden rounded-t-lg bg-white px-6 py-4">
          <div className=" inline-flex text-lg font-bold">
            {formatStatus(data.currentOrder?.status!)}
          </div>
          {data.currentOrder?.driver && (
            <div className="inline-flex items-center justify-between rounded-lg border py-4 px-6 text-lg font-bold">
              <p> {data.currentOrder?.driver?.title}</p>
              <div className=" inline-flex items-center gap-2">
                <BsTelephoneFill className=" h-6 w-6 rounded-full bg-green-500 p-1 text-white " />
                <IoMail className=" h-6 w-6 rounded-full bg-green-500 p-1 text-white " />
              </div>
            </div>
          )}
          <div className="flex flex-col items-start justify-between rounded-lg border py-4 px-6 text-lg font-bold">
            <p> {data.currentOrder?.establishment.title} </p>
            <div className="flex flex-col truncate text-base font-normal">
              {data.currentOrder?.cart?.orderItems?.map((item) => (
                <div className="flex items-center gap-2">
                  <p className="">{item.quantity}x</p>
                  <p className="truncate">{item.item.title}</p>
                </div>
              ))}
            </div>
          </div>
          {data.currentOrder?.orderPrice && (
            <div className=" rounded-lg border py-4 px-6 ">
              {data.currentOrder?.paymentType === "EWALLET"
                ? "GasPay "
                : "Cash"}
              <span className="font-bold">
                {formatter.format(
                  Number.parseInt(data.currentOrder?.orderPrice.toString())
                )}
              </span>
            </div>
          )}
        </div>
      </main>
    );
}
