const  express =require('express');
const http= require('http')
const mongoose =require( 'mongoose');
const multer = require('multer');

//excel
const xlsx =require( 'xlsx');
const { ppid } = require('process');
require( "dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/test333")



//setup
const app=express();
app.use(express.json());
const server=http.createServer(app);

const xlxs=require("./models/xlsx.js")

const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'),async  (req, res) => {
     // tải lên file
     console.log(req.file);
     const workbook = xlsx.readFile(req.file.path);
     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
     const jsonData = xlsx.utils.sheet_to_json(worksheet);
   
     // In ra JSON và lưu 
     for(let i = 0 ;i<jsonData.length;i++){
          const find=await xlxs.findOne({content:jsonData[i].content});
          let data=jsonData[i];
          if(!find)new xlxs(data).save();//lưu dữ liệu vào db
     }
     res.json(jsonData);
})

app.get("/",(req,res)=>{
     res.sendFile(__dirname+"/index.html")
})
server.listen(8080,()=>{
     console.log("listen on port:8080");
})