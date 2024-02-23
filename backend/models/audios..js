const mongoose = require("mongoose");

const audioSchema =new mongoose.Schema({

        url: {type: String, required: true},
        date: {type: Date , default: Date.now }
      
});

const audioModel = mongoose.model("recorderAudio",audioSchema)

module.exports = audioModel