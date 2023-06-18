import { useSession } from "next-auth/react";
import Spinner from "../../../components/Spinner";
import { api } from "../../../utils/api";
import CustomerBottomBar from "../../../components/customer/CustomerBottomBar";
import OrderItem from "../../../components/driver/orders/OrderItem";
import CustomerOrderItem from "../../../components/customer/order/CustomerOrderItem";

export default function CustomerOrdersPage(){ 
    const { data: session } = useSession();

    const { data, isLoading, error } = api.customer.orderStatusQuery.useQuery();
  
    return (
      <>
        <div className="w-full bg-main" style={{ height: 75 }}>
          <p className="px-12 py-5 text-3xl font-semibold tracking-widest text-gray-50">
            Orders
          </p>
        </div>
        <div className="flex flex-col gap-8 items-center justify-center pt-8 pb-32">
          {isLoading && <Spinner />}
          {data &&
            data.map((order) => (
              <CustomerOrderItem
                key={order.id}
                id={order.id}
                placeName={order.establishment.address?.place_name!}
                deliveryAddress={order.deliveryAddress}
                price={order.totalPrice}
                status={order.status}
                customer={order.customer.name}
              />
            ))}
        </div>
        <CustomerBottomBar />
      </>
    );
  

}