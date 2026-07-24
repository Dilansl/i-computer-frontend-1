import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import OrderDataModal from "../../components/orderDataModal";
import getFormattedPrice from "../../utils/price-formatter";
import formatTimestamp from "../../utils/date-formatter";

export default function AdminOrdersPage() {
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
        setTotalPages(1);
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

      setOrders(response.data.orders || []);
      setTotalOrders(response.data.totalOrders || 0);
      setTotalPages(response.data.totalPages || 1);

      setSelectedOrder((currentSelectedOrder) => {
        if (!currentSelectedOrder) {
          return null;
        }

        const updatedSelectedOrder =
          response.data.orders?.find(
            (order) =>
              order.orderId === currentSelectedOrder.orderId
          );

        return updatedSelectedOrder || currentSelectedOrder;
      });
    } catch (error) {
      console.error(
        error?.response?.data?.message ||
          "Failed to fetch orders"
      );

      setOrders([]);
      setTotalOrders(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  function handlePageSizeChange(event) {
    const newPageSize = Number(event.target.value);

    setPageSize(newPageSize);
    setPageNumber(1);
  }

  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber(
        (currentPage) => currentPage - 1
      );
    }
  }

  function goToNextPage() {
    if (pageNumber < totalPages) {
      setPageNumber(
        (currentPage) => currentPage + 1
      );
    }
  }

  return (
    <div className="relative min-h-full w-full pb-[100px]">
      {selectedOrder && (
        <OrderDataModal
          order={selectedOrder}
          closeModal={() => setSelectedOrder(null)}
          refresh={fetchOrders}
          isAdmin={true}
        />
      )}

      <div className="mb-6 flex min-h-[100px] w-full items-center justify-between rounded-lg bg-white p-4 shadow-2xl">
        <h1 className="text-2xl font-semibold text-accent">
          All Orders
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-accent">
            {totalOrders}
          </span>

          <span className="text-gray-600">
            {totalOrders === 1 ? "Order" : "Orders"}
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingScreen />
      ) : orders.length === 0 ? (
        <div className="rounded-lg bg-white p-10 text-center shadow">
          <p className="text-lg text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full min-w-[1100px] text-center">
            <thead className="h-[48px] bg-accent text-white">
              <tr>
                <th className="w-[10%] px-3">
                  Order ID
                </th>

                <th className="w-[15%] px-3">
                  Email
                </th>

                <th className="w-[14%] px-3">
                  Name
                </th>

                <th className="w-[9%] px-3">
                  City
                </th>

                <th className="w-[11%] px-3">
                  Phone
                </th>

                <th className="w-[13%] px-3">
                  Status
                </th>

                <th className="w-[13%] px-3">
                  Date
                </th>

                <th className="w-[10%] px-3">
                  Total Amount
                </th>

                <th className="w-[5%] px-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id || order.orderId}
                  className="min-h-[70px] border-b odd:bg-gray-200 even:bg-white"
                >
                  <td className="px-3 py-4 font-semibold">
                    {order.orderId || "-"}
                  </td>

                  <td className="break-all px-3 py-4">
                    {order.email || "-"}
                  </td>

                  <td className="px-3 py-4">
                    {`${order.firstName || ""} ${
                      order.lastName || ""
                    }`.trim() || "-"}
                  </td>

                  <td className="px-3 py-4">
                    {order.city || "-"}
                  </td>

                  <td className="px-3 py-4">
                    {order.phone || "-"}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    {order.date
                      ? formatTimestamp(order.date)
                      : "-"}
                  </td>

                  <td className="px-3 py-4 font-semibold text-accent">
                    {getFormattedPrice(
                      Number(order.totalAmount) || 0
                    )}
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      title="View order details"
                      aria-label={`View order ${
                        order.orderId || ""
                      }`}
                      onClick={() =>
                        setSelectedOrder(order)
                      }
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

      <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-4 rounded-lg bg-white p-3 shadow-2xl">
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={loading}
          className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value={2}>2 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>

        <button
          type="button"
          disabled={pageNumber === 1 || loading}
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
          disabled={
            pageNumber >= totalPages ||
            loading ||
            totalPages === 0
          }
          onClick={goToNextPage}
          className="rounded bg-gray-300 px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
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