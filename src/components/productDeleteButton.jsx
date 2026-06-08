import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ProductDeteleButton(props){


    const [isModalVisible, steIsModalvisible] = useState(false)

    

    const refresh = props.refresh;
    const productId = props.product;

    return(
        <>
        <CiTrash  className="text-red-600 " onClick={()=> steIsModalvisible(true)}/>
        {
            isModalVisible && (
                <div className="w-screen h-screen bg-black/70 fixed left-0 top-0 z-50 flex justify-center items-center">

                    <div className="w-[400px] h-[200px] bg-white rounded-2xl flex flex-col  overflow-hidden justify-between">
                        <div className="w-full h-[40px] bg-blue-600 flex  items-center justify-between p-2">
                            <h1 className="text-white text-lg font-semibold">confirm deletion</h1>
                            <IoClose  className="text-white hover:bg-red-500 cursor-pointer" onClick={()=>steIsModalvisible(false)}/>
                        </div>
                        <p className="p-4 text-center text-accent">Are you sure you want to delete this product with ID {productId} ?</p>

                        <div className="w-full p-2 flex justify-center items-center gap-8">
                            <button className=" w-[100px] p-2 text-accent bg-red-400 hover:bg-red-500 rounded-sm" onClick={()=>{
                                const token = localStorage.getItem("token");
                                api.delete("/products/" + productId , {
                                    headers:{
                                        Authorization : `Bearer ${token}` 
                                    } 
                                }).then(() => {
                                    toast.success("product deleted successfully")
                                    refresh();
                                    steIsModalvisible(false)
                                }).catch(()=> {
                                    toast.error("Error deleting product")
                                })
                            }}> Delete
                            </button>
                            <button className="w-[100px] p-2 text-accent bg-gray-500 hover:bg-gray-700 rounded-sm" onClick={()=>steIsModalvisible(false)}>
                                Cancel
                            </button>


                        </div>


                    </div>

                </div>
            )

        }

        </>
    )

}