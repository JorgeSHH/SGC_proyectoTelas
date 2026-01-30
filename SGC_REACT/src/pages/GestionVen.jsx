import React, { useState, useEffect } from "react";
import { ButtonExp } from "../components/ButtonExp";
import { getAllSalesWoman } from "../api/tasks.api";
import { Navbar } from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";

export function GestionVen() {
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  const token = localStorage.getItem("access");
  const [salesWoman, setSalesWoman] = useState([]);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [formRegistro, setFormRegistro] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: true,
    username: "",
    role: "saleswoman",
    password: ""
  });

  useEffect(() => {
    async function loadSalesWoman() {
      try {
        const response = await getAllSalesWoman();
        setSalesWoman(response);
        console.log(response);
      } catch (error) {
        console.error("Error al obtener las vendedoras: ", error);
      }
    }
    loadSalesWoman();
  }, []);

  // envio del registro
  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/saleswoman/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formRegistro),
      });

      if (response.ok) {
        toast.success("Vendedora registrada con éxito");
        setMostrarModalRegistro(false);
        setFormRegistro({
          first_name: "", last_name: "", email: "", phone: "",
          status: true, username: "", role: "saleswoman", password: ""
        });
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error("Error al registrar vendedora" + JSON.stringify(error));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //elimina vendedora
  const handleEliminar = async (saleswoman_id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar a esta vendedora? Esta acción no se puede deshacer.")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/saleswoman/${saleswoman_id}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success("Vendedora eliminada exitosamente");
          setSalesWoman(salesWoman.filter(v => v.saleswoman_id !== saleswoman_id));
        } else {
          const errorData = await response.json();
          toast.error("Error al eliminar: " + (errorData.detail || "No se pudo completar la acción"));
        }
      } catch (error) {
        console.error("Error en la petición:", error);
        toast.error("Error de conexión al intentar eliminar.");
      }
    }
  };

  //edicion de vendedoras
  const [vendedoraEditando, setVendedoraEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});

  const abrirModalEdicion = (vendedora) => {
    setVendedoraEditando(vendedora);
    setFormEdit({
      first_name: vendedora.first_name,
      last_name: vendedora.last_name,
      email: vendedora.email,
      phone: vendedora.phone,
      username: vendedora.username,
      status: vendedora.status
    });
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const id = vendedoraEditando.saleswoman_id;
      const datosAEnviar = {
        first_name: formEdit.first_name,
        last_name: formEdit.last_name,
        email: formEdit.email,
        phone: formEdit.phone,
        status: formEdit.status,
        username: formEdit.username,
        role: "saleswoman",
        password: formEdit.password,
      };

      const response = await fetch(`http://127.0.0.1:8000/api/users/saleswoman/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) {
        toast.success("Vendedora actualizada correctamente");
        setVendedoraEditando(null);
        setSalesWoman(salesWoman.map(v => v.saleswoman_id === id ? { ...v, ...formEdit } : v));
      } else {
        const errorData = await response.json();
        toast.error("Error al actualizar: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    }
  };

  // ✅ LÓGICA DE FILTRADO ACTUALIZADA
  const vendedorasFiltradas = salesWoman.filter((v) => {
    const termino = filtro.toLowerCase();

    // 1. Verificamos ID (convertido a string para comparar)
    const matchId = String(v.saleswoman_id).includes(termino);

    // 2. Verificamos Nombre (Nombre + Apellido)
    const nombreCompleto = `${v.first_name} ${v.last_name}`.toLowerCase();
    const matchNombre = nombreCompleto.includes(termino);

    return matchId || matchNombre;
  });

  // Lógica de paginación
  const totalPaginas = Math.ceil(
    vendedorasFiltradas.length / elementosPorPagina,
  );
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const VendedorasPaginado = vendedorasFiltradas.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const exportarExcel = () => {
    console.log("Exportando a Excel...");
    
  };

  const exportarPDF = () => {
    console.log("Exportando a PDF...");
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
                  placeholder="Buscar por ID, nombre"
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

              <ButtonExp
                onExportExcel={exportarExcel}
                onExportPDF={exportarPDF}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VendedorasPaginado.map((salesWomans) => (
                <div
                  key={salesWomans.saleswoman_id}
                  className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 hover:border-[#ec4444] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {salesWomans.first_name} {salesWomans.last_name}
                      </h3>
                      <p className="text-gray-300 text-sm">{salesWomans.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-400">ID:</span>{" "}
                      <span className="text-white">{salesWomans.saleswoman_id}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Email:</span>{" "}
                      <span className="text-white">{salesWomans.email}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Teléfono:</span>{" "}
                      <span className="text-white">{salesWomans.phone}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Fecha de Registro:</span>{" "}
                      <span className="text-white">{salesWomans.created_at}</span>
                    </p>
                    {/* ✅ NUEVO CAMPO: EMAIL DEL ADMINISTRADOR */}
                    <p>
                      <span className="text-gray-400">ID_Admin:</span>{" "}
                      <span className="text-white">
                        {salesWomans.administrator || "No especificado"}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => abrirModalEdicion(salesWomans)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors">
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(salesWomans.saleswoman_id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors">
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

        {/* --- MODAL DE REGISTRO --- */}
        {mostrarModalRegistro && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-gradient-to-br from-[#3a3b3c] to-[#2a2b2c] rounded-xl shadow-2xl p-6 border border-[#ec4444] max-w-2xl w-full overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-white mb-6">Registrar Nueva Vendedora</h2>

              <form onSubmit={handleRegistrar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                  <input type="text" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formRegistro.first_name} onChange={(e) => setFormRegistro({ ...formRegistro, first_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Apellido</label>
                  <input type="text" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formRegistro.last_name} onChange={(e) => setFormRegistro({ ...formRegistro, last_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Username</label>
                  <input type="text" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formRegistro.username} onChange={(e) => setFormRegistro({ ...formRegistro, username: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Password</label>
                  <input type="password" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formRegistro.password} onChange={(e) => setFormRegistro({ ...formRegistro, password: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input type="email" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formRegistro.email} onChange={(e) => setFormRegistro({ ...formRegistro, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
                  <input type="text" className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formRegistro.phone} onChange={(e) => setFormRegistro({ ...formRegistro, phone: e.target.value })} />
                </div>

                <div className="md:col-span-2 flex gap-3 mt-4">
                  <button type="button" onClick={() => setMostrarModalRegistro(false)} className="flex-1 bg-gray-600 text-white py-2 rounded">Cancelar</button>
                  <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded font-bold">Guardar Vendedora</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL DE EDICIÓN --- */}
        {vendedoraEditando && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-gradient-to-br from-[#1e1e2a] to-[#2a2b2c] rounded-xl shadow-2xl p-6 border border-blue-500 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Editar Vendedora</h2>

              <form onSubmit={handleGuardarEdicion} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                  <input type="text" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formEdit.first_name} onChange={(e) => setFormEdit({ ...formEdit, first_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Apellido</label>
                  <input type="text" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formEdit.last_name} onChange={(e) => setFormEdit({ ...formEdit, last_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Username</label>
                  <input type="text" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formEdit.username} onChange={(e) => setFormEdit({ ...formEdit, username: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input type="email" required className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formEdit.email} onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
                  <input type="text" className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formEdit.phone} onChange={(e) => setFormEdit({ ...formEdit, phone: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Nueva Contraseña (dejar en blanco si no desea cambiarla)
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white placeholder-gray-500"
                    placeholder="••••••••"
                    value={formEdit.password || ""}
                    onChange={(e) => setFormEdit({ ...formEdit, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estado</label>
                  <select
                    className="w-full p-2 bg-[#262729] border border-gray-600 rounded text-white"
                    value={formEdit.status}
                    onChange={(e) => setFormEdit({ ...formEdit, status: e.target.value === "true" })}
                  >
                    <option value="true">Activa</option>
                    <option value="false">Inactiva</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-3 mt-4">
                  <button type="button" onClick={() => setVendedoraEditando(null)} className="flex-1 bg-gray-600 text-white py-2 rounded">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold">Actualizar Datos</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}