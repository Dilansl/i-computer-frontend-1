import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function CreateOrder(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const cart = props.cart;

  async function placeOrder() {
    if (cart == null || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      addressLine1.trim() === "" ||
      city.trim() === "" ||
      phone.trim() === ""
    ) {
      toast.error("Please complete all required shipping details");
      return;
    }

    try {
      setIsLoading(true);

      const body = {
        firstName: firstName,
        lastName: lastName,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        phone: phone,
        items: []
      };

      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];

        body.items.push({
          productId: item.product.productId,
          quantity: item.qty
        });
      }

      const token = localStorage.getItem("token");

      if (token == null) {
        toast.error("You must log in before placing an order");
        navigate("/signin");
        return;
      }

      await api.post("/orders", body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Order placed successfully");

      setIsModalOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isModalOpen && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black/70 flex justify-center items-center z-50">
          <div className="w-[400px] bg-white rounded-lg flex flex-col items-center p-6 relative gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-3 text-xl font-bold"
            >
              X
            </button>

            <h2 className="text-2xl font-bold">
              Enter Shipping Details
            </h2>

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-[40px] border rounded-md px-3"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-[40px] border rounded-md px-3"
            />

            <input
              type="text"
              placeholder="Address Line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full h-[40px] border rounded-md px-3"
            />

            <input
              type="text"
              placeholder="Address Line 2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="w-full h-[40px] border rounded-md px-3"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-[40px] border rounded-md px-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[40px] border rounded-md px-3"
            />

            <button
              type="button"
              onClick={placeOrder}
              disabled={isLoading}
              className="w-full p-2 text-white bg-accent rounded-sm hover:bg-accent/90 disabled:opacity-60"
            >
              {isLoading ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-[220px] p-2 text-white bg-accent rounded-sm hover:bg-accent/90"
      >
        Order Now
      </button>
    </>
  );
}