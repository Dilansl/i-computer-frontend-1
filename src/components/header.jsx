import { BiCart } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function Header(){
    return(
        
        <header className="w-full h-[100px] bg-secondary p-6 flex items-center justify-between">
            <Link to="/">
                <img
                    src="/image.png"
                    alt="logo"
                    className="h-16 w-auto"
                />
            </Link>

            <div className="w-[300px] h-full  flex items-center justify-between">
                <Link to="/" className="text-accent font-semibold">Home</Link>
                <Link to="/products" className="text-accent font-semibold">Products</Link>
                <Link to="/contact-us" className="text-accent font-semibold">Contact Us</Link>
                
            </div>
            

            <div className="w-[300px] h-full">

                <Link to = "/cart" className="h-full flex justify-center items-center text-white hover:text-gray-900 px-4 cursor-pointer">
                    <BiCart size={24}></BiCart>

                </Link>


            </div>

        </header>
        
    )


}