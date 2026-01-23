import React from "react";
import "../index.css";
import miLogo from "../assets/castillo logo.jpg";

export function Navbar() {
  return (
    <nav
      id="nav-bar"
      className="bg-[#3b3c3e] shadow-sm border-b-10 border-[#ec4444]/60"
    >
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <img
              src={miLogo}
              className="h-10 w-10 rounded-full object-cover border border-gray-300"
              alt="Logo"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl text-[#ec4444] font-bold uppercase">
                {/* de usuario aqui ira si es vendedor o admnistrador */}
                Rol
              </h1>
              <p className="text-sm text-gray-200 font-bold uppercase">
                Sistema Administrativo
              </p>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-whitesmoke text-white font-bold uppercase">
                Ramses Barreto
              </p>
              <p className="text-xs text-white font-bold ">
                Codigo {/*  aquiva el codigo del usuario */}
              </p>
            </div>

            {/* Avatar o ícono de usuario */}
            <div>
              <button className="flex items-center space-x-2 text-[#ec4444] rounded-full">
                <div className="h-8 w-8 rounded-full bg-[#ec4444] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#3b3c3e]"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M4.5 6h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1m5 0h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1m-5 4h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
