import React from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">{children}</div>
    </div>
  );
};

export default Modal;
