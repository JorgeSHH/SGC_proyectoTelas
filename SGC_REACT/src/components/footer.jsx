import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-[#262729] text-white mt-auto">
      {/* Sección principal del footer - REDUCIDO ESPACIO */}
      <div className="container mx-auto px-4 py-4">
        {/* Contenedor de botones centrados con separación */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          {/* Botón Inicio - CON HOVER MEJORADO */}
          <div className="flex justify-center items-center">
            <button className="bg-gradient-to-r from-[#3b3c3e] to-[#ec4444] hover:from-[#ec4444] hover:to-[#3b3c3e] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 hover:brightness-110: min-w-28">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Inicio</span>
            </button>
          </div>
          {/* Botón Cerrar Sesión - CON HOVER MEJORADO */}
          <button className="bg-gradient-to-r from-[#3b3c3e] to-[#ec4444] hover:from-[#ec4444] hover:to-[#3b3c3e] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex justify-center items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 hover:brightness-110 min-w-25">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <hr className="border-gray-700 mb-3" />

        <div className="hidden sm:block">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-2 md:space-y-0">
            <div className="text-gray-400 text-xs">
              <p>
                &copy; 2024 Sistema de Gestión de Telas. Todos los derechos
                reservados a Armando Martinez, Ramses Barreto, Jorge holguin.
              </p>
              <p className="mt-0.5">
                Desarrollado para Didren y el Castillo, Venezuela
              </p>
            </div>
          </div>
        </div>

        <div className="sm:hidden text-center ">
          <div className="flex justify-center items-center space-x-2">
            <span className="text-gray-400 text-xs">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
