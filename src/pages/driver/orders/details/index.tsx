import { useRouter } from "next/router";
import { api } from "../../../../utils/api";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { Layer, Map, MapRef, Marker, Source } from "react-map-gl";
import { useEffect, useRef } from "react";
import { env } from "../../../../env.mjs";
import Spinner from "../../../../components/Spinner";
import { BsPinMap, BsTelephoneFill } from "react-icons/bs";
import main from "everify";
import { IoMail } from "react-icons/io5";
import formatStatus from "../../../../utils/formatStatus";
import formatter from "../../../../utils/formatter";
import { Status } from "@prisma/client";

export default function DriverOrderDetailsPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { id } = router.query;

  const { data, isLoading } = api.driver.detailsQuery.useQuery(
    {
      orderId: id?.toString()!,
    },
    {
      enabled: !!id,
    }
  );

  const { mutate, isLoading: isMutating } =
    api.merchant.orderStatusMutation.useMutation({
      onSettled: () => {
        utils.driver.detailsQuery.invalidate();
      },
    });

  const { mutate: acceptOrder } = api.driver.acceptOrder.useMutation({
    onSettled: () => {
      utils.driver.detailsQuery.invalidate();
    },
  });

  const ref = useRef<MapRef>(null);

  if (isLoading) return <Spinner />;

  if (data)
    return (
      <main className=" relative flex min-h-screen w-full flex-col pb-8">
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
          <div className=" inline-flex gap-1 text-lg font-bold">
            Status:
            <span className=" text-green-500">
              {formatStatus(data.currentOrder?.status!)}
            </span>
          </div>
          {data.currentOrder?.customer && (
            <div className="inline-flex items-center justify-between rounded-lg border py-4 px-6 text-lg font-bold">
              <p> {data.currentOrder?.customer?.name}</p>
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
        {data.currentOrder?.status === "FINISHED" ? (
          <p className=" px-6">Order finished</p>
        ) : (
          <StatusChangeButton
            status={data.currentOrder?.status!}
            mutate={() => {
              if (data.currentOrder?.status === "ORDER_ACCEPTED") {
                acceptOrder({
                  orderId: data.currentOrder?.id,
                });
              }
              mutate({
                status:
                  data.currentOrder?.status === "DRIVER_FOUND"
                    ? "DRIVER_PICKEDUP"
                    : "FINISHED",
                orderId: data.currentOrder?.id!,
              });
            }}
            isMutating={isMutating}
          />
        )}
      </main>
    );
}

function StatusChangeButton({
  status,
  mutate,
  isMutating,
}: {
  status: Status;
  mutate: Function;
  isMutating: boolean;
}) {
  return (
    <button
      onClick={() => {
        if (isMutating) return;
        mutate();
      }}
      className="relative mx-6"
    >
      {isMutating ? (
        <Spinner />
      ) : (
        <p className=" text-md relative w-full  rounded-lg border border-green-700 bg-green-100 py-2 text-center font-medium text-green-700  ">
          {status === "ORDER_ACCEPTED"
            ? "Accept Order"
            : status === "DRIVER_FOUND"
            ? "Pick Up Order"
            : "Deliver Order"}
        </p>
      )}
    </button>
  );
}
