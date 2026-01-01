import { useState } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";

const WhatsappChat = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const phoneNumber = "8801404049797";
  const message = encodeURIComponent(
    "Hello Appstick Team! 👋 I’m interested in discussing a web development project or collaboration with you."
  );

  const handleChatClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-2 w-64 bg-white shadow-lg rounded-xl p-4 flex flex-col gap-2 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Hi there! 👋</h4>
            <button onClick={() => setVisible(false)}>
              <FaTimes className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <p className="text-base text-gray-600">
            Welcome! 👋 I’m here to help you find what you need. Click below to
            chat on WhatsApp.
          </p>
          <button
            onClick={handleChatClick}
            className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <FaWhatsapp /> Chat Now
          </button>
        </div>
      )}

      {!open && (
        <div className="relative flex items-center justify-center">
          {/* Animated wave background */}
          <span className="absolute w-16 h-16 bg-green-400 rounded-full animate-ping opacity-70"></span>
          <span className="absolute w-16 h-16 bg-green-500 rounded-full animate-pulse opacity-50"></span>

          {/* WhatsApp main button */}
          <button
            onClick={() => setOpen(true)}
            className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-10 transition-transform duration-300 hover:scale-110"
          >
            <FaWhatsapp size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WhatsappChat;
