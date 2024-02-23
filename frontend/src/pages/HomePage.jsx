// import { useRef, useState } from "react";
// import RecordRTC from "recordrtc";
// const HomePage = ()=>{
//     const [isRecording, setIsRecording] = useState(false);
//     const audioRef = useRef(null);
//     let recordRTC;

//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             recordRTC = RecordRTC(stream, { type: 'audio' });
//             recordRTC.startRecording();
//             setIsRecording(true);
//         } catch (error) {
//             console.error("Error accessing microphone:", error);
//         }
//     };

//     const stopRecording = () => {
//         if (recordRTC) {
//             recordRTC.stopRecording(() => {
//                 const blob = recordRTC.getBlob();
//                 const audioURL = URL.createObjectURL(blob);
//                 audioRef.current.src = audioURL;
//             });
//             setIsRecording(false);
//         }
//     };

//     return (

//         <>
//         <div style={{display:"flex",justifyContent:"center",gap:"10px"}}>

//             <div>
//                <h1>Rcord Audio</h1>
//                {
//                 isRecording ? <button onClick={stopRecording}>Stop</button>:
//                 <button onClick={startRecording}>Record</button>
//                }

//                {/* <button style={{marginLeft:"10px"}}>Play</button> */}
//                <audio ref={audioRef} controls style={{ marginTop: '10px' }} />
//             </div>
//         </div>
//         </>
//     )
// };
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import RecordRTC from "recordrtc";

const HomePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  let [recordRTC, setRecordRTC] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordRTC = RecordRTC(stream, { type: "audio" });
      setRecordRTC(recordRTC);
      recordRTC.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    console.log(recordRTC);
    if (recordRTC && isRecording) {
      console.log("stop");
      recordRTC.stopRecording(() => {
        const blob = recordRTC.getBlob();
        const audioURL = URL.createObjectURL(blob);
        setAudioURL(audioURL);
      });
      setIsRecording(false);
    }
  };

  const handleSubmit = async()=>{
    try{

        const formData = new FormData();
        const audioBlob = await recordRTC.getBlob();
    const fileName = `recording_${Math.floor(Math.random() * 100) + 1}.wav`
        formData.append('name',fileName);
        formData.append('audio', audioBlob, fileName);
        formData.append('created_at', recordRTC.getBlob(),Date.now());
        const response = await axios.post(`http://localhost:3000/api/audio/add`,formData)
        console.log(response);

        
    }
    catch (error){
console.log(error)
    }
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Record Audio</h1>
      {isRecording ? (
        <button
          onClick={stopRecording}
          style={{
            padding: "10px 15px",
            background: "#319795",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
          }}
        >
          STOP
        </button>
      ) : (
        <button
          onClick={startRecording}
          style={{
            padding: "10px 15px",
            background: "#319795",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
          }}
        >
          RECORD
        </button>
      )}
      {audioURL && (
        <>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
          <audio controls src={audioURL} style={{ marginTop: "10px" }} />
          <button
            style={{
              padding: "10px 15px",
              background: "#319795",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
            }}
            onClick={handleSubmit}
          >
            Submit
          </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
