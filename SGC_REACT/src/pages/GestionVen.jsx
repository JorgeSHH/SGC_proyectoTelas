import React, { useState, useEffect } from "react";
import { ButtonExp } from "../components/ButtonExp";
import { getAllSalesWoman, updateSalesWoman } from "../api/tasks.api";

export function GestionVen() {
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  const [formEdit, setFormEdit] = useState({
    saleswoman_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: "",
    username: "",
    password: "",
  });



  const [salesWomanEditando, setSalesWomanEditando] = useState(null);
  const [salesWoman, setSalesWoman] = useState([]);

  useEffect(() => {
    async function loadSalesWoman() {
      try {
        const data = await getAllSalesWoman();
        setSalesWoman(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSalesWoman([]);
      }
    }
    loadSalesWoman();
  }, []);

  const vendedorasFiltradas = salesWoman.filter((v) =>
    Object.values(v).some((val) =>
      String(val).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(
    vendedorasFiltradas.length / elementosPorPagina
  );
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const VendedorasPaginado = vendedorasFiltradas.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const exportarExcel = () => console.log("Exportando a Excel...");
  const exportarPDF = () => console.log("Exportando a PDF...");

  const eliminarSalesWomans = (saleswoman_id) => {
    if (window.confirm("¿Estás seguro de eliminar esta vendedora?")) {
      setSalesWoman((prev) =>
        prev.filter((v) => v.saleswoman_id !== saleswoman_id)
      );
      alert("Vendedora eliminada exitosamente");
    }
  };

  const editarSalesWomans = (vendedora) => {
    setSalesWomanEditando(vendedora);
    setFormEdit({ ...vendedora });
  };

  /* ----------  NUEVA VERSIÓN ASÍNCRONA  ---------- */
  const guardarEdicion = async () => {
    try {
      await updateSalesWoman(formEdit.saleswoman_id, formEdit); // ← importada
      setSalesWoman(prev =>
        prev.map(v =>
          v.saleswoman_id === formEdit.saleswoman_id ? { ...formEdit } : v
        )
      );
      setSalesWomanEditando(null);
      setFormEdit({});
      alert("Vendedora actualizada");
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };
  /* -------------------------------------------------- */

  const cancelarEdicion = () => {
    setSalesWomanEditando(null);
    setFormEdit({});
  };

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

      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Gestión de Vendedoras
            </h1>
            <p className="text-gray-300 text-lg">
              Administración completa del personal
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por ID, nombre, apellido, email, teléfono, status..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => alert("Abrir formulario de registro")}
              className="bg-gradient-to-r from-white to-white text-black px-3 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              + Registrar
            </button>
            <ButtonExp
              onExportExcel={exportarExcel}
              onExportPDF={exportarPDF}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VendedorasPaginado.map((v) => (
              <div
                key={v.saleswoman_id}
                className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 hover:border-[#ec4444] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {v.first_name} {v.last_name}
                    </h3>
                    <p className="text-gray-300 text-sm">@{v.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">ID:</span>{" "}
                    <span className="text-white">{v.saleswoman_id}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Email:</span>{" "}
                    <span className="text-white">{v.email}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Teléfono:</span>{" "}
                    <span className="text-white">{v.phone}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Fecha de Registro:</span>{" "}
                    <span className="text-white">{v.created_at}</span>
                  </p>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => editarSalesWomans(v)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarSalesWomans(v.saleswoman_id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {vendedorasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No se encontraron vendedoras con ese criterio.
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
                )
              )}
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

      {salesWomanEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-br from-[#3a3b3c] to-[#2a2b2c] rounded-xl shadow-2xl p-8 border border-[#ec4444] max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Editar campos de las vendedoras
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                guardarEdicion();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formEdit.first_name || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, first_name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Apellido</label>
                <input
                  type="text"
                  value={formEdit.last_name || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, last_name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formEdit.email || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                <input
                  type="text"
                  value={formEdit.phone || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <input
                  type="text"
                  value={formEdit.status || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, status: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Usuario</label>
                <input
                  type="text"
                  value={formEdit.username || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, username: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#262729] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={formEdit.password || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, password: e.target.value })
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
    </div>
  );
}