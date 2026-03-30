import { useEffect, useRef, useState } from "react";
import { Camera, X, RotateCcw, CheckCircle2 } from "lucide-react";
import Modal from "./Modal";

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 🎥 Start Camera
  const startCamera = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access error:", err);
      setError(
        "Unable to access camera. Please allow permission or choose from device."
      );
      setIsInitializing(false);
    }
  };

  // 🔗 Attach stream to video
  useEffect(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current;

      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play().catch(() => {});
        setIsInitializing(false);
      };

      return () => {
        if (video) {
          video.srcObject = null;
        }
      };
    }
  }, [stream]);

  // 🛑 Stop Camera (FIXED)
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
  };

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
    }

    return () => stopCamera();
  }, [isOpen]);

  // 📸 Capture Photo (DO NOT stop camera here → smoother UX)
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (video.videoWidth === 0) {
      console.warn("Video not ready yet");
      return;
    }

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    setCapturedImage(dataUrl);
  };

  // 🔁 Retake (MAIN FIX)
  const handleRetake = () => {
    setCapturedImage(null);

    // Fully reset camera
    stopCamera();

    setTimeout(() => {
      startCamera();
    }, 200); // important delay
  };

  // ✅ Confirm
  const handleConfirm = () => {
    onCapture(capturedImage);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Capture Photo"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col items-center">
        {/* Camera Box */}
        <div className="w-full aspect-square bg-slate-100 rounded-[2rem] overflow-hidden border-4 border-slate-50 relative shadow-inner">

          {/* ERROR */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-red-50">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <X size={32} />
              </div>
              <p className="text-sm font-bold text-red-600 uppercase tracking-wide">
                {error}
              </p>
            </div>
          )}

          {/* VIDEO */}
          {!capturedImage && !error && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          {/* LOADER */}
          {isInitializing && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
              <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Initializing Camera...
              </p>
            </div>
          )}

          {/* IMAGE */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* BUTTONS */}
        <div className="w-full mt-8 flex flex-col gap-4">
          {!capturedImage && !error && (
            <button
              onClick={handleCapture}
              disabled={isInitializing}
              className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all active:scale-95 shadow-xl"
            >
              <Camera size={20} />
              Capture Photo
            </button>
          )}

          {capturedImage && (
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={handleRetake}
                className="py-5 bg-slate-100 text-slate-950 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-95"
              >
                <RotateCcw size={18} />
                Retake
              </button>

              <button
                onClick={handleConfirm}
                className="py-5 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-lg"
              >
                <CheckCircle2 size={18} />
                Confirm
              </button>
            </div>
          )}

          {error && (
            <button
              onClick={onClose}
              className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CameraCapture;