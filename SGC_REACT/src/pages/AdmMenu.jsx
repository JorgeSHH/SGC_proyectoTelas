import React from "react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/Button";
import { Footer } from "../components/footer";
import People from "../assets/person-check-fill.svg";
import fabricMaterial from "../assets/fabric-material-svgrepo-com (2).svg";
import scissors from "../assets/scissors-5-svgrepo-com.svg";
import Statistics from "../assets/statistics-svgrepo-com.svg";

export function AdmMenu() {
  return (
    <>
      <Navbar />

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
                Panel de Administración
              </h1>
              <p className="text-gray-300 text-lg">
                Gestión integral del sistema de telas
              </p>
            </div>

            {/* Grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
              <Button
                title="Gestión de Vendedoras"
                description="Control de Vendedoras"
                image={People}
                url="/gestion-ven"
              />
              
              <Button
                title="Gestión de Telas"
                description="Control de las Telas"
                image={fabricMaterial}
                url="/registro-tipos-tela"
              />
              
              <Button
                title="Gestión de Retazos"
                description="Control de los Retazos"
                image={scissors}
                url="/gestion-retazos"
              />
              
              <Button
                title="Dashboard Estadístico"
                description="Gráficos de Interés"
                image={Statistics}
                url="/dashboard"
              />

            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default AdmMenu;