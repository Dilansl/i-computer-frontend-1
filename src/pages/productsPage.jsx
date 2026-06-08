import { useEffect, useState } from "react"
import api from "../utils/api"
import LoadingScreen from "../components/loadingScreen"
import ProductCard from "../components/productCard"

export default function ProductsPage(){

    const[products, setProducts]=useState([])
    const[loading, setLoading] = useState(true)

    useEffect( ()=>{
        if(loading){
            api.get("/products")
            .then((res)=>{
                setProducts(res.data);
                setLoading(false);
            })
            .catch((error)=>{
                console.error("error fetching products:", error);
                setLoading(false);
            }
            )
        }
    },[loading]);


    return(
        <div className="w-full h-full flex justify-center items-center gap-4">
            {
                loading && <LoadingScreen/>
            }
            {
                !loading && <>
                    {
                        products.map((product)=>{
                            return(
                                <ProductCard key={product.id} product={product} key={product.productId} />
                            )
                        })
                    }
                </>
            }
        </div>
        
    )

}