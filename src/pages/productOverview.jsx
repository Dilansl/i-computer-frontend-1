import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../utils/api"
import LoadingScreen from "../components/loadingScreen"
import ProductImagesSlideShow from "../components/productImageeSlideShow"
import getFormattedPrice from "../utils/price-formatter"
import { addToCart, getCart  } from "../utils/cart"
import toast from "react-hot-toast"

export default function ProductOverview(){

    const parameters = useParams()
    const naviagete = useNavigate()
    const [product, setProduct] = useState(null)

    
    
    useEffect(()=>{
        if(parameters.productId == null){
            Navigate("/products")
        }
        api.get("/products/"+parameters.productId).then((res)=>{
            setProduct(res.data)
        }).catch((error)=>{
            console.error("Error fetching product details:" ,  error)
            naviagete("/products")
        })
    },[])
    



    return(
        <div  className="w-full h-full flex justify-center items-center">
            
            {
                product == null && <LoadingScreen/>
            }
            {
                product != null && <>
                    <div className="w-[50%] h-full flex justify-center items-center">
                        <ProductImagesSlideShow images = {product.image}/>

                    </div>

                    <div className="w-[50%] h-full flex flex-col p-6">
                        <span className="text-gray-500 text-sm italic mb-4">{product.productId}</span>

                        {/* brand and model */}
                        <p className="text-gray-500 text-sm italic mb-4">{product.brand+" "+product.model}</p>

                        <h1 className="text-3xl font-semibold mb-6">{product.name}
                            {
                                product.altNames.map(
                                    (altNames, index) => {
                                        return (
                                            <span key={index} className="text-sm text-gray-500 italic">{"( "+altNames+" )"}</span>
                                        )
                                    }
                                )
                            }
                        </h1>

                        {
                            product.price < product.labelledPrice && <p className="text-gray-500 text-lg line-through mb-2">{getFormattedPrice(product.labelledPrice)}</p>
                        }

                        <p className="text-xl text-accent font-semibold">{getFormattedPrice(product.price)}</p>

                        <p className="text-gray-700 mt-6">{product.description}</p>

                        <div className="flex">
                            <button className="w-[220px] p-2 text-white bg-accent rounded-sm hover:bg-accent/90 mt-6"
                                onClick={
                                    ()=>{
                                        addToCart(product , 1)
                                        toast.success("Product added to cart")
                                    }
                                }>Add to Cart
                            </button>
                            <Link className="w-[220px] p-2 text-gray-700 bg-gray-300 rounded-sm hover:bg-gray-400 mt-6 ml-4"
                                to="/checkout"
                                state={
                                    [
                                        {
                                            product : {
                                                productId : product.productId,
                                                name : product.name,
                                                image : product.image[0],
                                                price : product.price,
                                                labelledPrice : product.labelledPrice
                                            },
                                            qty : 1
                                        }
                                    ]
                                }
                            >Buy Now</Link>
                        </div>

                        

                    </div>

                
                </>
            }

        </div>
    )
}