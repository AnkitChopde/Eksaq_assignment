const express = require("express");
const audioModel = require("../models/audios.js");
const audioRouter = express.Router();

audioRouter.post('/add',async(req,res)=>{
    const newAudio =new audioModel(req.body)
    try{
        const savedAudio = await newAudio.save()
        res.status(200).send({data:savedAudio})
    }
    catch(err){
    res.status(400).send("Data has not been added")
    }
})


module.exports=audioRouter