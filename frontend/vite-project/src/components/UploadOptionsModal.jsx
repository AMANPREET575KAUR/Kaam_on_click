import { Camera, Image, ChevronRight } from "lucide-react";
import Modal from "./Modal";

/**
 * Modal to choose between taking a photo with the camera or choosing from the device.
 * @param {boolean} isOpen - Whether the modal is visible.
 * @param {Function} onClose - Callback when the modal should close.
 * @param {Function} onTakePhoto - Callback for "Take Photo".
 * @param {Function} onChooseFromDevice - Callback for "Choose from Device".
 */
const UploadOptionsModal = ({ isOpen, onClose, onTakePhoto, onChooseFromDevice }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Photo Source">
      <div className="space-y-4">
        {/* Take Photo Option */}
        <button
          onClick={() => {
            onTakePhoto();
            onClose();
          }}
          className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100/80 hover:shadow-lg hover:shadow-slate-200/50 rounded-3xl transition-all group group-active:scale-95"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Camera className="text-slate-950" size={24} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h4 className="text-base font-black text-slate-900 tracking-tight">Take Photo</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Directly using Camera</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={20} strokeWidth={3} />
        </button>

        {/* Choose from Device Option */}
        <button
          onClick={() => {
            onChooseFromDevice();
            onClose();
          }}
          className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100/80 hover:shadow-lg hover:shadow-slate-200/50 rounded-3xl transition-all group group-active:scale-95"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform">
              <Image className="text-slate-950" size={24} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h4 className="text-base font-black text-slate-900 tracking-tight">Choose from Device</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select from Gallery/Folders</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={20} strokeWidth={3} />
        </button>
      </div>
    </Modal>
  );
};

export default UploadOptionsModal;
