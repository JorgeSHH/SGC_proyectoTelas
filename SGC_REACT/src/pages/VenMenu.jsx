import React from "react";

import { Navbar } from "../components/navbar";
import { Button } from "../components/Button";
import { Footer } from "../components/footer";
import fabric from "../assets/fabric-svgrepo-com.svg";
import sewingMachine from "../assets/sewing-machine-svgrepo-com.svg";

<Navbar />;

export function VenMenu() {
  return (
    <div className="min-h-screen flex flex-col relative bg-gray-900">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(216, 68, 68, 0.6), rgba(30, 30, 42, 0.95)), url('/src/assets/wallpaper.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <main className="relative z-10 flex-1 flex justify-center items-center px-4 py-8">
        <section
          id="funcionalidades"
          className="flex flex-col gap-y-6 w-full max-w-6xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Panel de Vendedoras
            </h1>
            <p className="text-gray-300 text-lg">
              Gestión de retazos del sistema de telas
            </p>
          </div>

          {/* Grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              title="Registro de retazos"
              description="Generación de Qr y registro de retazos"
              image={fabric}
            />
            <Button
              title="Consulta y verificación de retazos"
              description="Registro de retazos introducidos al sistema"
              image={sewingMachine}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
<Footer />;
