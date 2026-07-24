import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import OrderDataModal from "../components/orderDataModal";
import getFormattedPrice from "../utils/price-formatter";
import formatTimestamp from "../utils/date-formatter";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [pageNumber, pageSize]);

  async function fetchOrders() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(0);
        return;
      }

      const response = await api.get(
        `/orders/${pageNumber}/${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const fetchedOrders = response.data.orders || [];

      setOrders(fetchedOrders);
      setTotalOrders(response.data.totalOrders || 0);
      setTotalPages(response.data.totalPages || 0);

      setSelectedOrder((currentSelectedOrder) => {
        if (!currentSelectedOrder) {
          return null;
        }

        const updatedOrder = fetchedOrders.find(
          (order) =>
            order.orderId === currentSelectedOrder.orderId
        );

        return updatedOrder || currentSelectedOrder;
      });
    } catch (error) {
      console.error(
        error?.response?.data?.message ||
          "Failed to fetch your orders"
      );

      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }

  function handlePageSizeChange(event) {
    setPageSize(Number(event.target.value));
    setPageNumber(1);
  }

  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber((currentPage) => currentPage - 1);
    }
  }

  function goToNextPage() {
    if (pageNumber < totalPages) {
      setPageNumber((currentPage) => currentPage + 1);
    }
  }

  return (
    <div className="relative min-h-full w-full px-4 pb-[100px] pt-6">
      {selectedOrder && (
        <OrderDataModal
          order={selectedOrder}
          closeModal={() => setSelectedOrder(null)}
          isAdmin={false}
        />
      )}

      <div className="mb-6 flex min-h-[100px] w-full items-center justify-between rounded-lg bg-white p-5 shadow-lg">
        <div>
          <h1 className="text-2xl font-semibold text-accent">
            My Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your previous and current orders
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-semibold text-accent">
            {totalOrders}
          </span>

          <p className="text-sm text-gray-500">
            {totalOrders === 1 ? "Order" : "Orders"}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingScreen />
      ) : orders.length === 0 ? (
        <div className="rounded-lg bg-white p-10 text-center shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            No orders found
          </h2>

          <p className="mt-2 text-gray-500">
            You have not placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full min-w-[800px] text-center">
            <thead className="h-[48px] bg-accent text-white">
              <tr>
                <th className="px-4 py-3">
                  Order ID
                </th>

                <th className="px-4 py-3">
                  Items
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3">
                  Date
                </th>

                <th className="px-4 py-3">
                  Total Amount
                </th>

                <th className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id || order.orderId}
                  className="border-b odd:bg-gray-100 even:bg-white"
                >
                  <td className="px-4 py-4 font-semibold">
                    {order.orderId || "-"}
                  </td>

                  <td className="px-4 py-4">
                    {getTotalItemQuantity(order.items)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {order.date
                      ? formatTimestamp(order.date)
                      : "-"}
                  </td>

                  <td className="px-4 py-4 font-semibold text-accent">
                    {getFormattedPrice(
                      Number(order.totalAmount) || 0
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      title="View order details"
                      aria-label={`View order ${
                        order.orderId || ""
                      }`}
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-full p-2 text-xl text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 0 && (
        <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-4 rounded-lg bg-white p-3 shadow-2xl">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rounded border px-3 py-2"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>

          <button
            type="button"
            disabled={pageNumber === 1}
            onClick={goToPreviousPage}
            className="rounded bg-gray-300 px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Previous
          </button>

          <span className="min-w-[110px] text-center">
            Page {pageNumber} of {totalPages}
          </span>

          <button
            type="button"
            disabled={pageNumber >= totalPages}
            onClick={goToNextPage}
            className="rounded bg-gray-300 px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function getTotalItemQuantity(items = []) {
  return items.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0
  );
}

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "border-purple-300 bg-purple-100 text-purple-700";

    case "shipped":
      return "border-blue-300 bg-blue-100 text-blue-700";

    case "completed":
    case "delivered":
      return "border-green-300 bg-green-100 text-green-700";

    case "cancelled":
    case "canceled":
      return "border-red-300 bg-red-100 text-red-700";

    case "processing":
    case "pending":
    default:
      return "border-yellow-300 bg-yellow-100 text-yellow-700";
  }
}