import { useState } from "react";
import toast from "react-hot-toast";

import api from "../utils/api";
import getFormattedPrice from "../utils/price-formatter";
import formatTimestamp from "../utils/date-formatter";

const ORDER_STATUSES = [
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled"
];

export default function OrderDataModal({
  order,
  closeModal,
  refresh,
  isAdmin = false
}) {
  const [status, setStatus] = useState(
    order?.status || "Processing"
  );

  const [updating, setUpdating] = useState(false);

  if (!order) {
    return null;
  }

  async function updateOrderStatus(newStatus) {
    if (!isAdmin) {
      return;
    }

    const previousStatus = status;

    try {
      setUpdating(true);
      setStatus(newStatus);

      const token = localStorage.getItem("token");

      if (!token) {
        setStatus(previousStatus);
        toast.error("You are not logged in");
        return;
      }

      await api.put(
        `/orders/${order.orderId}/status`,
        {
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Order status updated successfully");

      if (refresh) {
        await refresh();
      }
    } catch (error) {
      setStatus(previousStatus);

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  }

  function handleStatusChange(event) {
    updateOrderStatus(event.target.value);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 top-3 text-2xl font-bold text-gray-500 hover:text-red-600"
        >
          ×
        </button>

        <h2 className="mb-6 text-2xl font-bold text-accent">
          Order Details
        </h2>

        <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-100 p-4 md:grid-cols-2">
          <Detail
            label="Order ID"
            value={order.orderId}
          />

          <Detail
            label="Email"
            value={order.email}
          />

          <Detail
            label="Customer"
            value={`${order.firstName || ""} ${
              order.lastName || ""
            }`.trim()}
          />

          <Detail
            label="Phone"
            value={order.phone}
          />

          <Detail
            label="City"
            value={order.city}
          />

          <div>
            <p className="mb-1 text-sm font-semibold text-gray-500">
              Status
            </p>

            {isAdmin ? (
              <>
                <select
                  value={status}
                  disabled={updating}
                  onChange={handleStatusChange}
                  className={`w-full rounded-lg border px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-wait disabled:opacity-60 ${getStatusClasses(
                    status
                  )}`}
                >
                  {ORDER_STATUSES.map((orderStatus) => (
                    <option
                      key={orderStatus}
                      value={orderStatus}
                    >
                      {orderStatus}
                    </option>
                  ))}
                </select>

                {updating && (
                  <p className="mt-1 text-xs text-gray-500">
                    Updating status...
                  </p>
                )}
              </>
            ) : (
              <span
                className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${getStatusClasses(
                  status
                )}`}
              >
                {status}
              </span>
            )}
          </div>

          <Detail
            label="Date"
            value={
              order.date
                ? formatTimestamp(order.date)
                : "Date not available"
            }
          />

          <Detail
            label="Total Amount"
            value={getFormattedPrice(
              order.totalAmount || 0
            )}
          />

          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-gray-500">
              Delivery Address
            </p>

            <p className="text-gray-900">
              {order.addressLine1 || "-"}

              {order.addressLine2
                ? `, ${order.addressLine2}`
                : ""}

              {order.city
                ? `, ${order.city}`
                : ""}
            </p>
          </div>
        </div>

        <h3 className="mb-3 text-xl font-semibold text-accent">
          Ordered Items
        </h3>

        {order.items?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] overflow-hidden rounded-lg text-left">
              <thead className="bg-accent text-white">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Product ID</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item, index) => {
                  const product = item.product || {};
                  const quantity = Number(item.qty) || 0;
                  const price = Number(product.price) || 0;
                  const subtotal = price * quantity;

                  return (
                    <tr
                      key={`${
                        product.productId || "item"
                      }-${index}`}
                      className="border-b even:bg-gray-100"
                    >
                      <td className="p-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || "Product"}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
                            No image
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        {product.productId || "-"}
                      </td>

                      <td className="p-3">
                        <p className="font-semibold">
                          {product.name || "-"}
                        </p>

                        {product.labelledPrice != null && (
                          <p className="text-sm text-gray-500">
                            Labelled:{" "}
                            {formatLabelledPrice(
                              product.labelledPrice
                            )}
                          </p>
                        )}
                      </td>

                      <td className="p-3">
                        {getFormattedPrice(price)}
                      </td>

                      <td className="p-3">
                        {quantity}
                      </td>

                      <td className="p-3 font-semibold">
                        {getFormattedPrice(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
            No items found in this order.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg bg-accent px-6 py-2 text-white hover:bg-accent/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">
        {label}
      </p>

      <p className="text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}

function formatLabelledPrice(value) {
  if (typeof value === "number") {
    return getFormattedPrice(value);
  }

  return value || "-";
}

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "border-purple-300 bg-purple-100 text-purple-700";

    case "shipped":
      return "border-blue-300 bg-blue-100 text-blue-700";

    case "delivered":
      return "border-green-300 bg-green-100 text-green-700";

    case "cancelled":
    case "canceled":
      return "border-red-300 bg-red-100 text-red-700";

    case "processing":
    default:
      return "border-yellow-300 bg-yellow-100 text-yellow-700";
  }
}