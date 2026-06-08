import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import LoadingScreen from "../../components/loadingScreen";
import ProductDeteleButton from "../../components/productDeleteButton";
import { CiEdit } from "react-icons/ci";
import getFormattedPrice from "../../utils/price-formatter";


export default function AdminProductPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProducts();
    }, [loading]);

    async function loadProducts() {

        if(loading) {
            try {
            const token = localStorage.getItem("token");
            
            api.get("/products", { 
                headers: {
                Authorization: `Bearer ${token}`
            }}
           )
           .then( (res)=> {
                console.log(res.data);
                setProducts(res.data);
                setLoading(false)

           });
            
        } catch (error) {
            console.log(error);
        }
        }

        
    }

    return (
        <div className="w-full h-full p-5">

            

            <h1 className="text-3xl font-bold mb-5">
                Product Management
            </h1>

            {
                loading && <LoadingScreen/>
            }

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full border-collapse ">

                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Image</th>
                            <th className="border p-2">Product ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Alt Names</th>
                            <th className="border p-2">Category</th>
                            <th className="border p-2">Brand</th>
                            <th className="border p-2">Model</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Labelled Price</th>
                            <th className="border p-2">Stock</th>
                            <th className="border p-2">Available</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product._id}
                                className="hover:bg-gray-300 "
                            >
                                <td className="border p-2">
                                    <img
                                        src={product.image?.[0]}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>

                                <td className="border p-2">
                                    {product.productId}
                                </td>

                                <td className="border p-2">
                                    {product.name}
                                </td>

                                <td className="border p-2">
                                    {product.altNames?.join(", ")}
                                </td>

                                <td className="border p-2">
                                    {product.category}
                                </td>

                                <td className="border p-2">
                                    {product.brand || "-"}
                                </td>

                                <td className="border p-2">
                                    {product.model || "-"}
                                </td>

                                <td className="border p-2">
                                    {getFormattedPrice(product.price)}
                                </td>

                                <td className="border p-2">
                                    {getFormattedPrice(product.labelledPrice)}
                                </td>

                                <td className="border p-2 text-center">
                                    {product.stock}
                                </td>

                                <td className="border p-2 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            product.isAvailable
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {product.isAvailable
                                            ? "Available"
                                            : "Out Of Stock"}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    {/*<button
                                        
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={
                                                ()=>{
                                                    toast.success(product.productId)

                                                    const token = localStorage.getItem("token");
                                                    api.delete("/products/" + product.productId , {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`
                                                        }
                                                    }).then(
                                                        ()=> {
                                                            toast.success("product deleted successfully")
                                                            setLoading(!loading)
                                                            
                                                        }
                                                    ).catch(
                                                        ()=>{
                                                            toast.error("Error deleting product")
                                                        }
                                                    )

                                                }
                                            }
                                        >Delete
                                    </button>  */}
                                    <div className="flex items-center justify-center gap-4">
                                        <Link to="/admin/edit-product" state={product}><CiEdit  className="text-blue-600 "/></Link>
                                        <ProductDeteleButton product = {product.productId} refresh={()=>setLoading(true)}></ProductDeteleButton>

                                    </div>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            <Link
                to="/admin/add-product"
                className="bg-blue-600 w-[80px] h-[80px] rounded-full text-white text-4xl flex items-center justify-center fixed bottom-4 right-4 shadow-2xl hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
                <FaPlus />
            </Link>

        </div>
    );
}