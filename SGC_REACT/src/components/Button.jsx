import React from "react";
import Icono from "../assets/castillo logo.jpg";
import { useNavigate } from "react-router-dom";

export function Button({ title, description, image, url }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url);
  };

  return (
    <div
      onClick={handleClick}
      className={
        "bg-gradient-to-br from-[#3a3b3c]/40 to-[#2a2b2c]/40 hover:from-[#4a4b4c] hover:to-[#ec4444] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-[#ec4444] text-left w-full cursor-pointer "
      }
    >
      <button className="flex gap-10 py-2 min-h-22">
        <div className="fill-red-500 object-fit">
          <img
            src={image}
            alt="icon"
            className="w-16 h-16 object-fit rounded-ful "
          ></img>
        </div>
        <div className="max-w-full">
          <h4 className="text-white font-bold text-[20px]">{title}</h4>
          <p className="text-white font-lg">{description}</p>
        </div>
      </button>
    </div>
  );
}
