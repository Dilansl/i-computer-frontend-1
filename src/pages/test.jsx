import { useState } from "react"
import uploadMedia from "../utils/mediaUpload"
import { createClient } from "@supabase/supabase-js"

//const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1amtwaXNyemd0ZG1jZ2ZnYmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTk1MDcsImV4cCI6MjA5NTI5NTUwN30.sF17GMiSJynqfYfWHvnlxOQe3EhtxA7suV-tUC02lMs"
//const url = "https://zujkpisrzgtdmcgfgbkf.supabase.co"

//const supabase = createClient(url,key)

export default function TestPage(){

    const [file, setFile] = useState(null) 

    async function uploadFile(){
        const res = await uploadMedia(file)
        console.log(res)

        

   }
   
    return(
        <div className="w-full h-full bg-primary flex justify-center items-center" >
            <input type="file" onChange={
                (e)=>{
                    setFile(e.target.files[0])

                }
            }/>
            <button 
            onClick={uploadFile}
            className="bg-blue-400 p-4 rounded-lg text-accent">
                upload
            </button>
            

        </div>
    )

}