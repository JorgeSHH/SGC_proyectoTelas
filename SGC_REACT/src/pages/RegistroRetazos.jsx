import React, { useState, useEffect } from "react";
import { NavbarVen } from "../components/NavbarVen";
import toast, { Toaster } from "react-hot-toast";

export function RegistroRetazos() {
  const [formData, setFormData] = useState({
    fabric_type_id: "",
    length_meters: "",
    width_meters: "",
    description: "",
    historial_price: "",
  });

  const [tiposTela, setTiposTela] = useState([]);
  const [loading, setLoading] = useState(false);

  // OBTENER TIPOS DE TELA
  useEffect(() => {
    async function cargarTipos() {
      const token = localStorage.getItem("access");

      if (!token) {
        console.warn("No hay token disponible en localStorage");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/inventory/types/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setTiposTela(data);
        } else {
          console.error("Error status al cargar tipos:", response.status);
        }
      } catch (error) {
        console.error("Error al obtener los tipos de tela: ", error);
      }
    }
    cargarTipos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //ENVIAR DATOS AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fabric_type_id || isNaN(parseInt(formData.fabric_type_id))) {
      toast.error("Por favor selecciona un tipo de tela válido.");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("access");

    if (!token) {
      toast.error("No estás autenticado. Inicia sesión nuevamente."); 
      setLoading(false);
      return;
    }

    // Payload
    const payload = {
      fabric_type_id: parseInt(formData.fabric_type_id),
      length_meters: parseFloat(formData.length_meters),
      width_meters: parseFloat(formData.width_meters),
      description: formData.description,

      active: true,
    };

    console.log("Enviando payload:", payload);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/inventory/scraps/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        toast.success("Retazo registrado con éxito"); 
        setFormData({
          fabric_type_id: "",
          length_meters: "",
          width_meters: "",
          description: "",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Error del servidor:",
          JSON.stringify(errorData, null, 2),
        );

        let errorMsg = "Error al registrar.";
        if (errorData.detail) errorMsg += ` ${errorData.detail}`;
        if (errorData.errors)
          errorMsg += ` ${JSON.stringify(errorData.errors)}`;
        toast.error(errorMsg); 
      }
    } catch (error) {
      console.error("Error de red:", error);
      toast.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />{" "}

      <NavbarVen />
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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Nuevo Retazo
              </h1>
              <p className="text-gray-300">
                Ingresa la información del retazo de tela
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
  <label
    htmlFor="fabric_type_id"
    className="block text-sm sm:text-base md:text-lg font-medium text-gray-300 mb-2"
  >
    Tipo de Tela
  </label>
  <select
    id="fabric_type_id"
    name="fabric_type_id"
    value={formData.fabric_type_id}
    onChange={handleInputChange}
    className="
      w-full 
      px-3 py-2 sm:px-4 sm:py-3 
      bg-[#262729] 
      border border-gray-600 
      rounded-lg 
      text-white 
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent 
      transition-all duration-200
    "
    required
    disabled={loading}
  >
    <option value="" key="default">
      Selecciona un tipo...
    </option>

    {tiposTela.map((tipo) => (
      <option
        key={tipo.Fabric_Type_id}
        value={tipo.Fabric_Type_id}
      >
        {tipo.name} ({tipo.material_type})
      </option>
    ))}
  </select>

  {loading && tiposTela.length === 0 && (
    <p className="text-xs sm:text-sm text-gray-400 mt-1">
      Cargando tipos...
    </p>
  )}
</div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="length_meters"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Largo (metros)
                  </label>
                  <input
                    type="number"
                    id="length_meters"
                    name="length_meters"
                    value={formData.length_meters}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.15"
                    className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="width_meters"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Ancho (metros)
                  </label>
                  <input
                    type="number"
                    id="width_meters"
                    name="width_meters"
                    value={formData.width_meters}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.15"
                    className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe las características del retazo..."
                  rows="4"
                  className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                  required
                />
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Guardando..." : "Registrar Retazo"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
