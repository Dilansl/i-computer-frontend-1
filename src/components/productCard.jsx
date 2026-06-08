import { Link } from "react-router-dom"
import getFormattedPrice from "../utils/price-formatter"

export default function ProductCard(props){

    const product = props.product

    return(
        
        <Link to= {"/overview/"+ product.productId} className = " w-70 h-96 rounded-lg flex flex-col shadow-2xl bg-white overflow-hidden">
            
            <img src = {product.image[0]} className="w-full h-[60%] object-cover rounded-tl-lg rounded-tr-lg"/>
            <div className="w-full h-[40%] p-4 flex flex-col justify-between">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                
                {
                    product.price < product.labelledPrice && <p className="text-accent line-through">{getFormattedPrice(product.price)}</p>
                }
                <p className="text-secondary text-lg font-semibold">{getFormattedPrice(product.price)}</p>

            </div>
        </Link>
    ) 
}
