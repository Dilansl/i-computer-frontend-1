import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductsPage from "./productsPage";
import ProductOverview from "./productOverview";
import CartPage from "./cartPage";
import CheckoutPage from "./checkout";
import MyOrdersPage from "./myOrdersPage";


export default function HomePage(){

    return(
        <div className="w-full h-full bg-primary text-accent">
            <Header/>
            <div className="w-full h-[calc(100%-100px)] p-4">
                <Routes>
                    <Route path= "/" element={<h1>Home Page</h1>}/>
                    <Route path= "/products" element={<ProductsPage/>}/>
                    <Route path= "/contact-us" element={<h1>contact us Page</h1>}/>
                    <Route path= "/about-us" element={<h1>about us page</h1>}/>
                    <Route path= "/*" element={<h1>404 page</h1>}/>
                    <Route path= "/overview/:productId" element={<ProductOverview/>}/>
                    <Route path= "/cart" element={<CartPage/>}/>
                    <Route path= "/checkout" element={<CheckoutPage/>}/>
                    <Route path="/my-orders" element={<MyOrdersPage />} />
                </Routes>
            </div>
        </div>
    )
}