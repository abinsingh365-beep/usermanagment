 import fs from "fs";
 import {fileURLToPath} from "url";
 import multer from "multer"
 import path from "path"

console.log("metaurl",import.meta.url);

 const filename = fileURLToPath(import.meta.url);
 
 const dirname = path.dirname(filename);
 
 const uploadPath = path.join(dirname,"../uploads");

 if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath,{recursive:true});
 }

  const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb (null,uploadPath)
    },
    filename: (req,file,cb)=>{
        cb (null,Date.now()+"-"+file.originalname+path.extname(file.originalname))
    }
  })
    const upload = multer({storage})
    export default upload