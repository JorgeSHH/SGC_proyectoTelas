import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-[#262729] text-white mt-auto">
      {/* Sección principal del footer - REDUCIDO ESPACIO */}
      <div className="container mx-auto px-4 py-4">
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
            <span className="text-gray-400 text-xs">
              2026 Sistema de Gestión de Telas. Todos los derechos reservados a
              Armando Martinez, Ramses Barreto, Jorge holguin.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
