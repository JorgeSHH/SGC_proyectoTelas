import React, { useState, useEffect } from "react";
import { ButtonExpTPT } from "../components/ButtonExpTPT";
import { Navbar } from "../components/Navbar";
import { SecureImage } from "../components/SecureImage";
import toast, { Toaster } from "react-hot-toast";

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

  // Filtrado MODIFICADO
  const retazosFiltradas = retazos.filter((retazo) => {
    const terminoBusqueda = filtro.toLowerCase();

    const id = String(retazo.fabric_scrap_id || "").toLowerCase();
    const rol = String(retazo.created_by_role || "").toLowerCase();
    const creador = String(retazo.created_by || "").toLowerCase();

    return (
      id.includes(terminoBusqueda) ||
      rol.includes(terminoBusqueda) ||
      creador.includes(terminoBusqueda)
    );
  });

  const totalPaginas = Math.ceil(retazosFiltradas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const retazosPaginadas = retazosFiltradas.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

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
        console.error(errorMsg);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };
  // 1. Función principal que llama al Toast de confirmación
  const eliminarRetazos = (fabric_scrap_id) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-3 p-4 bg-[#2d2d2d] text-white rounded-lg shadow-xl border border-gray-600 min-w-[320px]">
          <div className="flex items-center gap-3">
            <div className="text-left">
              <h3 className="font-bold text-sm">¿Eliminar retazo?</h3>
              <p className="text-xs text-gray-400">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id); // Cierra la alerta
                procesarEliminacionRetazo(fabric_scrap_id); // Ejecuta la lógica de borrado
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors font-bold shadow-md"
            >
              Eliminar
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Mantiene el toast abierto hasta que el usuario decida
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      },
    );
  };

  // 2. Función secundaria que hace la petición DELETE real
  const procesarEliminacionRetazo = async (fabric_scrap_id) => {
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
        fetchRetazos(); // Recarga la tabla de retazos
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.detail ||
            "No se puede eliminar: Este retazo tiene asociaciones.",
        );
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Hubo un error de conexión al intentar eliminar.");
    }
  };

  const editarRetazos = (retazos) => {
    setRetazosEditando(retazos);
    setFormEdit({
      ...retazos,
      active: Boolean(retazos.active),
    });
  };

  const guardarEdicion = async () => {
    try {
      const id = formEdit.fabric_scrap_id;
      const datosAEnviar = {
        description: formEdit.description,
        length_meters: formEdit.length_meters,
        width_meters: formEdit.width_meters,
        active: formEdit.active === true,
      };

      console.log("Enviando datos al backend:", datosAEnviar);

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
        toast.error("Error al actualizar:");
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

  const calcularPrecioRetazo = (retazo) => {
    const area = (retazo.width_meters || 0) * (retazo.length_meters || 0);
    const precioPorMetroCuadrado = retazo.fabric_type?.price_unit;
    return area * precioPorMetroCuadrado;
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
                  placeholder="Buscar por ID, Rol y usuario que lo registró"
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
              {retazosPaginadas.map((retazos) => {
                const precio = calcularPrecioRetazo(retazos);
                const isActive = retazos.active;

                return (
                  <div
                    key={retazos.fabric_scrap_id}
                    className={`rounded-xl shadow-lg p-6 border transition-all duration-300 relative ${
                      isActive
                        ? "bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 border-gray-600 hover:border-[#ec4444]"
                        : "bg-gray-900 border-gray-800 opacity-60 grayscale hover:opacity-80 hover:grayscale-0"
                    }`}
                  >
                    {}
                    {!isActive && (
                      <div className="absolute top-2 right-4 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full border border-gray-500 z-10">
                        VENDIDO / INACTIVO
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white mt-2 font-bold text-lg">
                          {retazos.fabric_scrap_id}/Retazo de{" "}
                          {retazos.fabric_type?.name ||
                            retazos.fabric_type_id ||
                            "Tipo Desconocido"}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-400">
                          Fecha de registro:
                        </span>{" "}
                        <span className="text-white">
                          {new Date(retazos.registered_at).toLocaleDateString()}
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

                      <div className="flex justify-between ">
                        <span>
                          <span className="text-gray-400">Rol:</span>{" "}
                          <span className="text-white">
                            {retazos.created_by_role}
                          </span>
                        </span>
                        <div>
                          <span className="text-gray-400">Creador:</span>{" "}
                          <span className="text-white">
                            <span className="text-white">
                              {retazos.created_by}
                            </span>
                          </span>
                        </div>
                      </div>

                      <p>
                        <span className="text-gray-400">Precio:</span>{" "}
                        <span className="text-white">${precio.toFixed(2)}</span>
                      </p>

                      <p>
                        <span className="text-gray-400">Descripción:</span>{" "}
                        <br />
                        {/* line-clamp-3 corta el texto a 3 líneas. break-words rompe palabras largas si es necesario */}
                        <span
                          className="text-white block break-words line-clamp-3"
                          title={retazos.description}
                        >
                          {retazos.description}
                        </span>
                      </p>

                      <div className="mt-2 px-4 py-4 rounded-lg flex justify-center">
                        <SecureImage
                          id={retazos.fabric_scrap_id}
                          alt={`QR para retazo ${retazos.fabric_scrap_id}`}
                          className="w-80 h-80 object-contain rounded-lg"
                        />
                      </div>
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
                );
              })}
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

                {/* Selector de Estado Activo/Inactivo*/}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado del Retazo
                  </label>
                  <select
                    value={formEdit.active ? "true" : "false"}
                    onChange={(e) =>
                      setFormEdit((prev) => ({
                        ...prev,
                        active: e.target.value === "true",
                      }))
                    }
                    className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="true">Activo (En Stock)</option>
                    <option value="false">Vendido / Desactivado</option>
                  </select>
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
                    maxLength="250" // <--- Limita el texto a 250 caracteres
                    className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none  block mt-1 overflow-y-auto break-words max-h-24" // <--- resize-none evita que se agrande y rompa el diseño
                    rows="3"
                    placeholder="Detalles del retazo..."
                    required
                  />

                  {/* Contador de caracteres */}
                  <div className="text-right mt-1">
                    <span
                      className={`text-xs ${
                        formRegistro.description.length >= 250
                          ? "text-red-500 font-bold" // Se pone rojo si llega al límite
                          : "text-gray-500"
                      }`}
                    >
                      {formRegistro.description.length}/250
                    </span>
                  </div>
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
