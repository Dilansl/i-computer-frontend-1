import { createClient } from "@supabase/supabase-js"

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1amtwaXNyemd0ZG1jZ2ZnYmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTk1MDcsImV4cCI6MjA5NTI5NTUwN30.sF17GMiSJynqfYfWHvnlxOQe3EhtxA7suV-tUC02lMs"
const url = "https://zujkpisrzgtdmcgfgbkf.supabase.co"

const supabase = createClient(url,key)

export default function uploadMedia(file){
    
    return new Promise(
        (resolve, reject) =>{
            if(file == null){
                reject("No file provided")
            }else{
                const timestamp = new Date().getTime();
                const fileName = timestamp + "-" + file.name;

                supabase.storage.from("images").upload(fileName, file)
                .then(
                    ()=>{
                        const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
                        resolve(publicUrl);
                    }
                ).catch((error)=>{
                    reject(error);
                });
            }
        }

    );

}
