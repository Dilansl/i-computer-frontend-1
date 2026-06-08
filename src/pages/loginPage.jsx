import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiKey } from "react-icons/bi";
import { GrGoogle } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function LoginPage(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    

    async function handleLogin(){
        
        setLoading(true)

        try{
            const res = await api.post("/users/login" , 
                {
                    email: email,
                    password: password
                }
            )
            console.log(res.data)
            localStorage.setItem("token" , res.data.token)

            if(res.data.isAdmin){

                navigate("/admin")

            }else{
                navigate("/")
            }

        }catch(err){
            
            toast.error(err?.response?.data?.message || "login failed")
            
        }

        setLoading(false)

    }


    return(
        <div className="w-full h-full bg-[url('/login-bg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">

            <div className="w-[400px] h-[600px]  backdrop-blur-lg shadow-2xl shadow-amber-50 rounded-2xl p-4 flex flex-col">
                <h1 className="w-full h-[80px] font-bold text-white text-center text-3xl">Login</h1>

                <div className="w-full ">
                    <label className="text-white text-lg flex items-center  gap-2"><MdEmail/>Email</label>
                    <input className="w-full h-[30px] rounded-md px-2 border border-white" type="email" placeholder="Enter your Email"
                    onChange={
                        (e)=>{
                            
                            console.log(e.target.value)
                            setEmail(e.target.value)
                        }
                    }
                    value={email}
                    />
                </div>

                <div className="w-full mt-5 ">
                    <label className="text-white text-lg flex items-center  gap-2"><BiKey/>Password</label>
                    <input className="w-full h-[30px] rounded-md px-2 border border-white" type="password" placeholder="Enter your Password"
                    onChange={
                        (e)=>{
                            
                            console.log(e.target.value)
                            setPassword(e.target.value)
                        }
                    }
                    value={password}
                    type="password"
                    />

                </div>

                <p className="w-full h-3 mt-2 text-white text-right italic">Frogrt password? click <Link to="/froget-password" className="font-bold text-yellow-200">Here</Link></p> 

                <button disabled={loading} className="w-full h-[50px] bg-blue-950 mt-10 text-white rounded-b-lg" onClick={handleLogin}>
                    {
                        loading ? "loading..." : "Signup"

                    }
                    
                </button> 

                <p className="w-full h-3 mt-2 text-white text-right italic">Don't have an account? click <Link to="/register" className="font-bold text-yellow-200">Here</Link></p> 

                <button className="w-full h-[50px] bg-black mt-5 text-white rounded-b-lg flex justify-center items-center gap-2"><GrGoogle/>Sign in with google</button>

            </div>
            
        </div>
    )
}