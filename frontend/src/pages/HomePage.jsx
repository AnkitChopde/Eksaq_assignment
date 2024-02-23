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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from "../firebaseApp";

const HomePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  let [recordRTC, setRecordRTC] = useState(null);
  const [audioData,setAudioData] = useState([]);

  const storage = getStorage(firebaseApp);
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

  const fetchData = async() => {
try{
  const response =axios.get("https://recorder-backend-2.onrender.com/api/audio")
  if(response){
    setAudioData(response.data)
  }

}
catch (err){

}
  }

  useEffect(()=>{
  if(audioData?.length===0){
    fetchData()
  }
  },[audioData])

  const handleSubmit = async () => {
    try {
      const audioRef = ref(storage, `recording-${Date.now()}.wav`);
      const blob = recordRTC.getBlob();
      await uploadBytes(audioRef, blob);
      const url = await getDownloadURL(audioFirebaseRef);

      const response = await axios.post(
        `https://recorder-backend-2.onrender.com/api/audio/add`,
        { url: url }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{width:"60%",margin:"auto", display: "flex", flexDirection: "row",justifyContent:"space-between", alignItems: "center",gap:"20px" }}
    >
      <div>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
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
      <div>
        <h1>Recorded Audios</h1>
        {
          audioData?.length>0 ? (
            <>
            {
              audioData?.map((audio)=>(
                <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <audio controls src={audio.url} style={{ marginTop: "10px" }} />
            <button
              style={{
                padding: "10px 15px",
                background: "#319795",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
              }}
              // onClick={handleSubmit}
            >
              Delete
            </button>
          </div>
              ))
            }
            </>
          ):(
            <>
            <h6>Audios Data not found</h6>
            </>
          )
        }
      </div>
    </div>
  );
};

export default HomePage;
