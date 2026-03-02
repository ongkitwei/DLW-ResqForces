"use client";
import { useRef, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
// 1. IMPORT YOUR ACTION
import { classifyEmergency } from "@/app/actions/classify"; 

export default function CameraModal({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImg, setCapturedImg] = useState(null);
  // 2. ADD LOADING STATE
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let stream = null;
    async function startCamera() {
      if (isOpen) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            },
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Camera error:", err);
          alert("Could not access camera.");
        }
      }
    }
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setCapturedImg(canvas.toDataURL("image/jpeg", 0.7));    }
  };

  // 3. CREATE THE NEW HANDLER
  const handleSendReport = async () => {
    if (!capturedImg) return;
    
    setIsAnalyzing(true);
    try {
      // Calls your classify.js function with the captured image
      const result = await classifyEmergency(capturedImg);
      
      if (result.error) {
        alert("Analysis Error: " + result.error);
      } else {
        // Displays the 'Justification' from Gemini
        alert(`🚨 STATUS: ${result.rank}\n\n📝 REASON: ${result.reason}`);
        onClose();
        setCapturedImg(null); // Reset for next use
      }
    } catch (err) {
      console.error("Failed to send report:", err);
      alert("System error. Check your terminal logs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white"
        >
          <IoClose size={24} />
        </button>

        <div className="p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Emergency Capture</h3>

          <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-6 border-4 border-slate-200">
            {capturedImg ? (
              <img src={capturedImg} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-4 w-full">
            {!capturedImg ? (
              <button
                onClick={takePhoto}
                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
              >
                TAKE PHOTO
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCapturedImg(null)}
                  disabled={isAnalyzing}
                  className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-xl font-bold disabled:opacity-50"
                >
                  RETAKE
                </button>
                <button
                  // 4. UPDATE THE ONCLICK
                  onClick={handleSendReport}
                  disabled={isAnalyzing}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-slate-400 active:scale-95 transition-all"
                >
                  {isAnalyzing ? "ANALYZING..." : "SEND REPORT"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}