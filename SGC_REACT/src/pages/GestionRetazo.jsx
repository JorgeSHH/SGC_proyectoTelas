import React, { useState, useEffect } from "react";
import { ButtonExpTPT } from "../components/ButtonExpTPT";
import { Navbar } from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
// Importamos el componente SecureImage
import { SecureImage } from "../components/SecureImage";


<Toaster />;
export function GestionRetazo() {

  const [retazos, setRetazos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [listaTipos, setListaTipos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [retazosEditando, setRetazosEditando] = useState(null);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [formEdit, setFormEdit] = useState({});

  const [formRegistro, setFormRegistro] = useState({
    length_meters: "",
    width_meters: "",
    description: "",
    fabric_type: "",
  });

  const elementosPorPagina = 6;
  const token = localStorage.getItem("access");

  const fetchRetazos = async () => {
    try {
      if (!token) return;
      const response = await fetch(
        "http://127.0.0.1:8000/api/inventory/scraps/",
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
        setRetazos(data);
      }
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  useEffect(() => {
    fetchRetazos();
  }, []);

  useEffect(() => {
    async function cargarTipos() {
      try {
        if (!token) return;
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
          setListaTipos(data);
        } else {
          console.error("Error status al cargar tipos:", response.status);
        }
      } catch (error) {
        console.error("Error al obtener los tipos de tela: ", error);
      }
    }
    cargarTipos();
  }, []);

  // --- Filtrado ---
  const retazosFiltradas = retazos.filter((v) =>
    Object.values(v).some((val) =>
      String(val).toLowerCase().includes(filtro.toLowerCase()),
    ),
  );

  const totalPaginas = Math.ceil(retazosFiltradas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const retazosPaginadas = retazosFiltradas.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  // --- FUNCIÓN SIMPLIFICADA: Solo envía datos del retazo ---
  const handleRegistrar = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        fabric_type_id: parseInt(formRegistro.fabric_type),
        length_meters: parseFloat(formRegistro.length_meters),
        width_meters: parseFloat(formRegistro.width_meters),
        description: formRegistro.description,
        active: true,
      };

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
        setMostrarModalRegistro(false);
        setFormRegistro({
          length_meters: "",
          width_meters: "",
          description: "",
          fabric_type: "",
        });
        fetchRetazos();
      } else {
        const errorData = await response.json();
        console.error(
          "Error detallado del backend:",
          JSON.stringify(errorData, null, 2),
        );
        let errorMsg = "Error al registrar.";
        if (errorData.detail) errorMsg += ` ${errorData.detail}`;
        if (errorData.fabric_type)
          errorMsg += ` Tipo: ${errorData.fabric_type}`;
        if (errorData.non_field_errors)
          errorMsg += ` ${errorData.non_field_errors.join(", ")}`;
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  // 1. Función que muestra el Toast con los botones
  const eliminarRetazos = (fabric_scrap_id) => {
    toast.custom((t) => (
      <div className="bg-[#3a3b3c] border border-[#ec4444] justify-center text-center text-white px-6 py-4 rounded-lg shadow-2xl flex flex-col items-center gap-3 min-w-[300px]">
        <p className="text-center font-medium">
          ¿Estás seguro de eliminar este tipo de tela?
        </p>
        <div className="flex gap-4 w-full justify-center items-center">
          <button
            onClick={() => {
              toast.dismiss(t.id); // Cerrar el toast
              ejecutarEliminacion(fabric_scrap_id); // Ejecutar lógica real
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors font-bold"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Solo cerrar el toast
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded transition-colors"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  // 2. Función separada que contiene la lógica del API (la que estaba dentro del if)
  const ejecutarEliminacion = async (fabric_scrap_id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/inventory/scraps/${fabric_scrap_id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        toast.success("Retazo eliminado exitosamente");
        fetchRetazos();
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.detail ||
            "No se puede eliminar: Esta tela tiene retazos asociados.",
        );
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Hubo un error de conexión al intentar eliminar.");
    }
  };

  const editarRetazos = (retazos) => {
    setRetazosEditando(retazos);
    setFormEdit({ ...retazos });
  };

  const guardarEdicion = async () => {
    try {
      const id = formEdit.fabric_scrap_id;
      const datosAEnviar = {
        description: formEdit.description,
        length_meters: formEdit.length_meters,
        width_meters: formEdit.width_meters,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/inventory/scraps/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosAEnviar),
        },
      );

      if (response.ok) {
        toast.success("Retazos actualizados correctamente (PATCH)");
        setRetazosEditando(null);
        fetchRetazos();
      } else {
        const errorData = await response.json();
        console.log("Error del backend:", errorData);
        toast.error("Error al actualizar: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      toast.error("No se pudo conectar con el servidor.");
    }
  };

  const cancelarEdicion = () => {
    setRetazosEditando(null);
    setFormEdit({});
  };

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

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Gestion de Retazos
            </h1>
            <p className="text-gray-300 text-lg">
              Administración completa de los retazos sobrantes de las telas
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por ID, precio, tipo, fecha..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={() => setMostrarModalRegistro(true)}
              className="bg-gradient-to-r from-white to-white text-black px-3 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              + Registrar
            </button>

            <ButtonExpTPT />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retazosPaginadas.map((retazos) => (
              <div
                key={retazos.fabric_scrap_id}
                className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 hover:border-[#ec4444] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {retazos.fabric_scrap_id}/Retazo de{" "}
                      {retazos.fabric_type?.name ||
                        retazos.fabric_type_id ||
                        "Tipo Desconocido"}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Fecha de registro:</span>{" "}
                    <span className="text-white">
                      {retazos.registered_at}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Precio Histórico:</span>{" "}
                    <span className="text-white">
                      ${retazos.historial_price || retazos.historial_price} {/* Ajustado key basado en tu snippet */}
                    </span>
                  </p>

                  <div className="flex justify-between ">
                    <span>
                      <span className="text-gray-400">Ancho (metro):</span>{" "}
                      <span className="text-white">
                        {retazos.width_meters}
                      </span>
                    </span>
                    <div>
                      <span className="text-gray-400">Largo (metro):</span>{" "}
                      <span className="text-white">
                        {retazos.length_meters}
                      </span>
                    </div>
                  </div>

                  <p>
                    <span className="text-gray-400">Descripcion:</span> <br />
                    <span className="text-white">{retazos.description}</span>
                  </p>

                  {/* --- SECCIÓN MODIFICADA: QR DINÁMICO --- */}
                  <div className="mt-2 px-4 py-4 rounded-lg flex justify-center">
                    <SecureImage 
                      id={retazos.fabric_scrap_id} 
                      alt={`QR para retazo ${retazos.fabric_scrap_id}`}
                      className="w-80 h-80 object-contain rounded-lg" 
                    />
                  </div>
                  {/* ------------------------------------- */}
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => editarRetazos(retazos)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarRetazos(retazos.fabric_scrap_id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {retazosFiltradas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No se encontraron retazos con ese criterio.
              </p>
            </div>
          )}

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
      {retazosEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-br from-[#3a3b3c] to-[#2a2b2c] rounded-xl shadow-2xl p-8 border border-[#ec4444] max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Editar Retazos
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
                  Ancho (metro)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formEdit.width_meters || ""}
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      width_meters: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Largo (metro)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formEdit.length_meters || ""}
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      length_meters: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

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

      {/* --- MODAL DE REGISTRO --- */}
      {mostrarModalRegistro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-gradient-to-br from-[#3a3b3c] to-[#2a2b2c] rounded-xl shadow-2xl p-8 border border-[#ec4444] max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-white mb-6">
              Registrar Nuevo Retazo
            </h2>

            <form onSubmit={handleRegistrar} className="space-y-4">
              {/* Selector de Tipo de Tela */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Tela
                </label>
                <select
                  value={formRegistro.fabric_type}
                  onChange={(e) =>
                    setFormRegistro({
                      ...formRegistro,
                      fabric_type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Seleccione una tela...</option>
                  {listaTipos.map((tipo) => (
                    <option
                      key={tipo.Fabric_Type_id}
                      value={tipo.Fabric_Type_id}
                    >
                      {tipo.name} ({tipo.material_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Campo: Largo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Largo (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.15"
                    value={formRegistro.length_meters}
                    onChange={(e) =>
                      setFormRegistro({
                        ...formRegistro,
                        length_meters: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Min: 0.15"
                    required
                  />
                </div>

                {/* Campo: Ancho */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ancho (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.15"
                    value={formRegistro.width_meters}
                    onChange={(e) =>
                      setFormRegistro({
                        ...formRegistro,
                        width_meters: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Min: 0.15"
                    required
                  />
                </div>
              </div>

              {/* Campo: Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formRegistro.description}
                  onChange={(e) =>
                    setFormRegistro({
                      ...formRegistro,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Detalles del retazo..."
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
    </>
  );
}