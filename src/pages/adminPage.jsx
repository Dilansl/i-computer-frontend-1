import { Link, Route, Routes } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { GoGift } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import AdminProductPage from "./admin/adminProductPage";
import AdminAddproductFrom from "./admin/adminAddProductFrom";
import AdminEditproductFrom from "./admin/adminEditProductFrom";
import AdminOrdersPage from "./admin/adminOrdersPage";

export default function AdminPage(){

    

    return(
        <div className="w-full h-full bg-primary flex">

            <div className="w-[300px] h-full bg-white flex flex-col shadow-2xl">
                <div className="w-full h-[100px]  px-2 py-1 ">

                    <img src = "/image.png" className=" h-full "/>

                </div>

                <Link to="/admin" className="w-full  p-4 text-accent flex items-center gap-4">
                    <FiShoppingCart />
                    <span className="w-full h-full">Orders</span>

                </Link>

                <Link to="/admin/products" className="w-full  p-4 text-accent  flex items-center gap-4">
                    <GoGift />
                    <span className="w-full h-full">Products</span>

                </Link>

                <Link to="/admin/users" className="w-full  p-4 text-accent  flex items-center gap-4">
                    <LuUser/>
                    <span className="w-full h-full">Users</span>

                </Link>
                

            </div>

            <div className="w-[calc(100%-300px)] h-full p-4">
                <Routes>

                    <Route path='/' element={<AdminOrdersPage/>} />
                    <Route path='/products' element={<AdminProductPage/>} />
                    <Route path='/users' element={<h1>Users Page</h1>} />
                    <Route path='/add-product' element={<AdminAddproductFrom/>} />
                    <Route path='/edit-product' element={<AdminEditproductFrom/>} />
                    
                    



                </Routes>



            </div>


        </div>
    )
}