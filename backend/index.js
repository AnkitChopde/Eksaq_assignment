
const express = require("express");
const cors = require("cors")
const connection = require("./config/db");
const audioRouter = require("./routes/audios.routes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/api/audio",audioRouter)

app.listen(process.env.PORT,async()=>{
   try{
    await connection
    console.log("Database conection success!")
   }
   catch(err){
    console.log(err+"while mking database connection!")
   }
});

