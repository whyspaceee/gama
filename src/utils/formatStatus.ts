import { Status } from "@prisma/client";

export default function formatStatus(status: Status) {
  switch (status) {
    case "DRIVER_FOUND":
      return "Driver Found";
    case "DRIVER_PICKEDUP":
      return "Driver Picked Up";
    case "CANCELLED":
      return "Cancelled";
    case "DRIVER_ARRIVED":
      return "Driver Arrived";
    case "FINISHED":
      return "Finished";
    case "ORDER_ACCEPTED":
      return "Order Accepted";
    case "ORDER_DECLINED":
      return "Order Declined";
    case "STARTED":
      return "Started";
    default:
        return status
  }
}
