import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uploadMedia from "../../utils/mediaUpload";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AdminAddproductFrom(){

    const[productId, setProductId] = useState("");
    const[name, setName] = useState("");
    const[altNames, setAltNames] = useState("");
    const[description, setDescription] = useState("");
    const[price, setPrice] = useState("");
    const[labelledPrice, setLabelledPrice] = useState("");
    const[images, setImages] = useState([]);
    const[isAvailable, setIsAvailable] = useState(true);
    const[category, setCategory] = useState("");
    const[stock, setStock] = useState(0);
    const[brand, setBrand] = useState("");
    const[model, setModel] = useState("");
    const[isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    async function addProduct() {

        setIsLoading(true);

        const token = localStorage.getItem("token")

        if (token == null){
            toast.error("u must be login to  add a product")
            navigate("/signin")
            return;
        }

        const imageUploadPromises= []

        // FIX 1: "leti" → "let i" (was a ReferenceError)
        for(let i=0; i<images.length; i++){
            imageUploadPromises.push(uploadMedia(images[i]))
        }

    try{
        const imageUrls = await Promise.all(imageUploadPromises)
        console.log(imageUrls)

        const altNamesArray = altNames.split(",")
        console.log(altNamesArray)

        const requestBody = {
            productId : productId,
            name : name,
            altNames : altNamesArray,
            description : description,
            price : price,
            labelledPrice : labelledPrice,
            image : imageUrls,
            isAvailable : isAvailable,
            category : category,
            stock : stock,
            brand : brand,
            model : model
        }

        await api.post("/products", requestBody ,
            {
                headers : {
                    Authorization : "Bearer " + token
                }

            }
        )

        toast.success("product added successfully")
        navigate("/admin/products") 
        setIsLoading(false);       

    }catch(error){
        
        toast.error(error?.response?.data?.message || "Failed to add product")
        setIsLoading(false);
    }   
        
    }

    

    return(
        <div className="w-full h-full items-center flex-col ">
            <div className="w-full h-[100px] bg-white shadow-2xl rounded-lg flex p-4 items-center justify-between ">
                <h1 className="text-2xl font-semibold text-accent m-2">Add New Product</h1>
                <div className="h-full gap-4 flex items-center ">
                    <Link to="/admin/products" className="bg-red-700 text-white w-[100px] text-center py-2 rounded-lg">Cancel</Link>
                    <button disabled={isLoading} className="bg-green-500 text-white w-[100px] text-center py-2 rounded-lg cursor-pointer " onClick={addProduct}>{isLoading ? "Saving..." : "Save"}</button>

                </div>

            </div>

            <div className="w-full flex  h-[300px] p-4 flex-wrap">  
                
                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    {/* FIX 3: "lable" → "label" throughout */}
                    <label className="font-semibold">Product ID</label>
                    <input value={productId} onChange={(e)=>setProductId(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="PD-001"></input>
                </div>

                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold">Product name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="Enter Product name"></input>
                </div>

                <div className="text-accent w-[50%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold" >Alternative name <span className="italic text-sm text-gray-400">(Comma seperated)</span></label>
                    <input value={altNames} onChange={(e)=>setAltNames(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="VGA, Grafic Card, GPU, CPU"></input>
                </div>
                
                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold" >price</label>
                    <input value={price} onChange={(e)=>setPrice(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="0.00"></input>
                </div>
                
                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold" >labelled Price</label>
                    <input value={labelledPrice} onChange={(e)=>setLabelledPrice(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="0.00"></input>
                </div>
                
                <div className="text-accent w-full h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold" >Description</label>
                    <textarea value={description} onChange={(e)=>setDescription(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="Enter product description"></textarea>
                </div>
                
                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold" >Images</label>
                    {/* FIX 2: "setFile" → "setImages" (was a ReferenceError) */}
                    <input multiple={true}  onChange={(e)=>{setImages(e.target.files)}} type="file" className="border w-full rounded-lg " placeholder=""></input>
                </div>
                
                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold">Availibilty</label>
                    <select value={isAvailable} onChange={(e)=>setIsAvailable(e.target.value)} className="w-full h-[40px] border rounded-lg px-2">
                        <option value={true}>Available</option>
                        <option value={false}>Unavailable</option>
                    </select>
                </div>

                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold">Stock</label>
                    <input value={stock} onChange={(e)=>setStock(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="Enter Product name"></input>
                </div>

                <div className="bg-red-300 w-[25%] h-[70px] flex flex-col px-2 my-2 "></div>
                
                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2 ">
                    <label className="font-semibold">Category</label>
                    <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full h-[40px] border rounded-lg px-2">
                        <option value="cpu">CPU</option>
                        <option value="gpu">GPU</option>
                        <option value="ram">RAM</option>
                        <option value="storage">Storage</option>
                        <option value="motherboard">Motherboard</option>
                        <option value="graphicc card">Graphic Cards</option>
                    </select>
                </div>
                
                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Brand <span className="italic text-sm text-gray-400">(Optional)</span></label>
                    {/* FIX 4: was using "category" state and "setCategory" — corrected to "brand" / "setBrand" */}
                    <select value={brand} onChange={(e)=>setBrand(e.target.value)} className="w-full h-[40px] border rounded-lg px-2">
                        <option value="nvidia">NVIDIA</option>
                        <option value="amd">AMD</option>
                        <option value="intel">Intel</option>
                        <option value="asus">ASUS</option>
                        <option value="msi">MSI</option>
                        <option value="apple">Apple</option>
                    </select>
                </div>

                <div className="text-accent w-[25%] h-[70px] flex flex-col px-2 my-2">
                    <label className="font-semibold">Model <span className="italic text-sm text-gray-400">(Optional)</span></label>
                    <input value={model} onChange={(e)=>setModel(e.target.value)}className="border w-full rounded-lg h-[40px]" placeholder="Enter Product name"></input>
                </div>   
            </div>
        </div>
    )
    
}