import React, { useState, useEffect } from "react";
import Image from "../assets/QR.png";
import { getAllScraps } from "../api/tasks.api";




export function RegistroTiposTela() {
  const [tiposDeTelas, setTiposDeTelas] = useState([]); // 🔴 REEMPLAZAR: useState([]) y fetch desde backend
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [tiposDeTelasEditando, setTiposDeTelasEditando] = useState(null);// Para el modal de edición
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false); 
  const [formEdit, setFormEdit] = useState({}); // Formulario de edición
  const [formRegistro, setFormRegistro] = useState({
    name: "",
    material_type: "",
    description: "",
    price_unit: ""
  });
  const elementosPorPagina = 6;

  //cargar los datos del backend con el token
  // Obtener Token
  const token = localStorage.getItem("access");

  // cargar los datos (GET)
  const fetchTiposTelas = async () => {
    try {
      if (!token) return;
      const response = await fetch("http://127.0.0.1:8000/api/inventory/types/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTiposDeTelas(data);
      }
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  useEffect(() => {
    fetchTiposTelas();
  }, []);

  // Función para Registrar (POST)
  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/inventory/types/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formRegistro),
      });

      if (response.ok) {
        alert("Tela registrada con éxito");
        setMostrarModalRegistro(false);
        setFormRegistro({ name: "", material_type: "", description: "", price_unit: "" });
        fetchTiposTelas(); // Recargar lista
      } else {
        alert("Error al registrar. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  // 🔴 REEMPLAZAR: Conectar con tu endpoint de búsqueda
  const tiposDeTelasFiltradas = tiposDeTelas.filter((v) =>
    Object.values(v).some((val) =>
      String(val).toLowerCase().includes(filtro.toLowerCase()),
    ),
  );

  // Lógica de paginación
  const totalPaginas = Math.ceil(
    tiposDeTelasFiltradas.length / elementosPorPagina,
  );
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const tiposDeTelasPaginadas = tiposDeTelasFiltradas.slice(
    indiceInicio,
    indiceFin,
  );

  // Cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

// 🔴 ELIMINAR: Conexión real con el backend
const eliminarTiposDeTelas = async (fabric_type_id) => {
  if (window.confirm("¿Estás seguro de eliminar este tipo de tela?")) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/inventory/types/${fabric_type_id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Tipo de tela eliminada exitosamente");
        fetchTiposTelas(); // Recargamos la lista del servidor
      } else {
        // Si el backend prohibe el borrado (por retazos asociados) caerá aquí
        const errorData = await response.json();
        alert(errorData.detail || "No se puede eliminar: Esta tela tiene retazos asociados.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error de conexión al intentar eliminar.");
    }
  }
};

  // 🔴 EDITAR: Abre el modal de edición
  const editarTiposDeTelas = (tiposDeTela) => {
    setTiposDeTelasEditando(tiposDeTela);
    setFormEdit({ ...tiposDeTela }); // Copia todos los campos
  };

  // 🔴 GUARDAR EDICIÓN: Actualiza la tiposDeTelas en el estado local
  const guardarEdicion = async () => {
    try {
      const id = formEdit.Fabric_Type_id; 
      
      // Creamos un objeto con los nombres de campos que espera el BACKEND
      const datosAEnviar = {
        name: formEdit.name,
        material_type: formEdit.type || formEdit.material_type, // Ajuste por si cambia el nombre
        description: formEdit.description,
        price_unit: parseFloat(formEdit.price_unit) // Aseguramos que sea número
      };

      const response = await fetch(`http://127.0.0.1:8000/api/inventory/types/${id}/`, {
        method: "PATCH", // <--- Cambiado de PUT a PATCH
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) {
        alert("Tela actualizada correctamente (PATCH)");
        setTiposDeTelasEditando(null);
        fetchTiposTelas(); // Refrescar la tabla/lista
      } else {
        const errorData = await response.json();
        // Esto te dirá exactamente qué campo falló (ej: "price_unit: debe ser positivo")
        console.log("Error del backend:", errorData);
        alert("Error al actualizar: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  // 🔴 CANCELAR EDICIÓN: Cierra el modal sin guardar
  const cancelarEdicion = () => {
    setTiposDeTelasEditando(null);
    setFormEdit({});
  };

  const [filtro1, setFiltro1] = useState("");
 
  
  useEffect(() => {
    
    
    async function loadProducts() {
      try {
        const response = await getAllScraps();
        setFiltro1(response);
        console.log(response);
      } catch (error) {
        console.error("Error al obtener los productos: ", error);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    console.log(filtro1);
    
  }, [filtro1]);

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-900">
      {/* Fondo idéntico a VenMenu */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(216, 68, 68, 0.6), rgba(30, 30, 42, 0.95)), url('/src/assets/wallpaper.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      /
      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Registro de los Tipos de Telas
            </h1>
            <p className="text-gray-300 text-lg">
              Administración completa de las telas de las que parten los retazos
            </p>
          </div>

          {/* Barra de búsqueda y botones de acción */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Búsqueda */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por ID, precio, tipo, fecha..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Botón Registrar */}
            <button
              onClick={() => setMostrarModalRegistro(true)}
              className="bg-gradient-to-r from-white to-white text-black px-3 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              + Registrar
            </button>
          </div>

          {/* Tarjetas de tiposDeTelas - MÁXIMO 6 POR PÁGINA */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiposDeTelasPaginadas.map((tiposDeTela) => (
              <div
                key={tiposDeTela.Fabric_Type_id}
                className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 hover:border-[#ec4444] transition-all duration-300"
              >
                {/* Header de la tarjeta */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {tiposDeTela.Fabric_Type_id}/Tela de {tiposDeTela.material_type}
                    </h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                
                  <p>
                    <span className="text-gray-400">Fecha de registro:</span>{" "}
                    <span className="text-white">
                      {tiposDeTela.registered_at}
                    </span>
                  </p>
                  <p>
                    <span className="-1/2 overflow-hidden text-ellipsis text-gray-400">
                      Descripcion:
                    </span>{" "}
                    <br />
                    <span className="text-white">
                      {tiposDeTela.description}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">
                      Precio por unidad (metro):
                    </span>{" "}
                    <span className="text-white">
                      {tiposDeTela.price_unit} $
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Nombre:</span>{" "}
                    <span className="text-white">{tiposDeTela.name}</span>
                  </p>
                  <div className="mt-2 px-8 py-8 sm:">
                    <img
                      src={Image}
                      alt={tiposDeTela.name}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => editarTiposDeTelas(tiposDeTela)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-1"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>
                  <button
                   onClick={() => eliminarTiposDeTelas(tiposDeTela.Fabric_Type_id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-1"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay resultados */}
          {tiposDeTelasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No se encontraron tiposDeTelas con ese criterio.
              </p>
            </div>
          )}

          {/* ✅ PAGINACIÓN - Solo se muestra si hay más de 6 elementos */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (numero) => (
                    <button
                      key={numero}
                      onClick={() => cambiarPagina(numero)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        paginaActual === numero
                          ? "bg-red-600 text-white"
                          : "bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white"
                      }`}
                    >
                      {numero}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </main>
      {/* Modal de Edición */}
      {tiposDeTelasEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-br from-[#3a3b3c] to-[#2a2b2c] rounded-xl shadow-2xl p-8 border border-[#ec4444] max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Editar tipos De Telas
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarEdicion();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de tela
                </label>
                <input
                  type="text"
                  value={formEdit.type || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripcion
              </label>
              <input
                type="text"
                value={formEdit.description || ""}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio por unidad(metro)
                </label>
                <input
                  type="float"
                  value={formEdit.price_unit || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, price_unit: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formEdit.name || ""}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <div></div>

              <div></div>
              <div></div>

              {/* Botones de acción */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- INSERTAR AQUÍ: Modal de Registro --- */}
      {mostrarModalRegistro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-gradient-to-br from-[#3a3b3c] to-[#2a2b2c] rounded-xl shadow-2xl p-8 border border-[#ec4444] max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-white mb-6">
              Registrar Nueva Tela
            </h2>

            <form onSubmit={handleRegistrar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de la Tela</label>
                <input
                  type="text"
                  value={formRegistro.name}
                  onChange={(e) => setFormRegistro({ ...formRegistro, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Seda Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Material</label>
                <input
                  type="text"
                  value={formRegistro.material_type}
                  onChange={(e) => setFormRegistro({ ...formRegistro, material_type: e.target.value })}
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Algodón / Poliéster"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                <textarea
                  value={formRegistro.description}
                  onChange={(e) => setFormRegistro({ ...formRegistro, description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Detalles de la tela..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Precio por Unidad (Metro)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formRegistro.price_unit}
                  onChange={(e) => setFormRegistro({ ...formRegistro, price_unit: e.target.value })}
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setMostrarModalRegistro(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroTiposTela;
