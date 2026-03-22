import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Reusable Modal component with Framer Motion animations.
 * @param {boolean} isOpen - Whether the modal is visible.
 * @param {Function} onClose - Callback when the modal should close.
 * @param {React.ReactNode} children - Modal content.
 * @param {string} title - Optional title for the modal.
 * @param {string} maxWidth - Optional max-width class (default: max-w-md).
 */
const Modal = ({ isOpen, onClose, children, title, maxWidth = "max-w-md" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-all"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full ${maxWidth} bg-white rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden border border-white`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                {title ? (
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                ) : (
                  <div />
                )}
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
