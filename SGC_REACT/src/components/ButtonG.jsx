import React from "react";

export function ButtonG({ onClick }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="min-w-3xs bg-gradient-to-br from-[#3a3b3c] to-[#2a2b2c] hover:from-[#4a4b4c] hover:to-[#ec4444] text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:brightness-110 border border-gray-600 hover:border-[#ec4444] cursor-pointer"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-white font-bold text-base">Guardar</span>
      </div>
    </button>
  );
}