import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function UserData() {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState("me");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token != null) {
      api
        .get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
        });
    }
  }, []);

  return (
    <>
      {user == null ? (
        <div>
          <Link
            to="/signin"
            className="text-white hover:text-gray-300"
          >
            Login
          </Link>

          <span className="text-white px-2">|</span>

          <Link
            to="/register"
            className="text-white hover:text-gray-300"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="text-white flex items-center">
          <img
            src={
              user.image ||
              "/defult_profile.png"
            }
            className="w-8 h-8 rounded-full inline-block mr-2 object-cover"
            alt="Profile"
          />

          <select
            className="bg-transparent border-0 outline-none cursor-pointer"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);

              if (e.target.value === "settings") {
                navigate("/settings");
              }

              if (e.target.value === "my-orders") {
                navigate("/my-orders");
              }

              if (e.target.value === "logout") {
                localStorage.removeItem("token");
                setUser(null);
                navigate("/");
              }

              setSelectedOption("me");
            }}
          >
            <option value="me" className="bg-black text-white" >
              {user.firstName}
            </option>

            <option value="settings" className="bg-black text-white">
              Settings
            </option>

            <option value="my-orders" className="bg-black text-white">
              My Orders
            </option>

            <option value="logout" className="bg-black text-white">
              Logout
            </option>
          </select>
        </div>
      )}
    </>
  );
}