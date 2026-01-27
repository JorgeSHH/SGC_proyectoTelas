import React, { useState } from "react";
import { NavbarVen } from "../components/NavbarVen";
import { ButtonG } from "../components/ButtonG";



export function RegistroRetazos() {


  
  const [formData, setFormData] = useState({
    tipoDeTela: "",
    id: "",
    metrosDelargo: "",
    metrosDealto: "",
    descripcion: "",
  });

  // ESTA PROVA ES PARA MANEJAR LOS CAMBJIOS DE LOS INPUTS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //  AQUÍ DEBEMOS GUARDAR LA INFORMACIÓN QUE VA PARA LA VAINA ESTA DE BACKEND
    console.log("Datos del retazo:", formData);
    alert("Retazo registrado exitosamente");
  };

  return (
    <>
    <NavbarVen/>


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
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#3a3b3c]/58 to-[#2a2b2c] rounded-xl shadow-2xl p-8 border border-[#ec4444]">
          {/* Formulariopsa */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Nuevo Retazo</h1>
            <p className="text-gray-300">
              Ingresa la información del retazo de tela
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                id="id"
                value={formData.type_scrap}
                onChange={handleInputChange}
                placeholder="Ej: Retazo de algodón rojo"
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="codigo"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Codigo
              </label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                placeholder="Ej: RET-001"
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="tipoTela"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Tipo de Tela
              </label>
              <select
                id="tipoTela"
                name="tipoTela"
                value={formData.tipoTela}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                required
              >
                {" "}
                {/* yo me imagino que debe verse asi la vaina */}
                <option value="">Selecciona un tipo</option>
                <option value="algodon">Algodón</option>
                <option value="poliester">Poliéster</option>
                <option value="seda">Seda</option>
                <option value="lana">Lana</option>
                <option value="lino">Lino</option>
                <option value="mezcla">Mezcla</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="largo"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Largo (metros)
                </label>
                <input
                  type="number"
                  id="largo"
                  name="largo"
                  value={formData.largo}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="alto"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Alto (metros)
                </label>
                <input
                  type="number"
                  id="alto"
                  name="alto"
                  value={formData.alto}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe las características del retazo..."
                rows="4"
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                required
              />
            </div>
            <div className="pt-4 flex justify-center fa-align-center">
              <ButtonG onClick={() => console.log("Guardando...")} />
            </div>
          </form>
        </div>
      </main>
    </div>    </>
  );
}

export default RegistroRetazos;
