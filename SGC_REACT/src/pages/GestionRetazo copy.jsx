import { useState, useEffect } from "react";
import { ButtonExp } from "../components/ButtonExp";
import Image from "../assets/QR.png";

// 🔴 REEMPLAZAR: fetch real desde tu backend
const RetazosEjemplo = [
  {
    id: "07",
    Vendedora: "Maria",
    tipoDeTela: "Algodón",
    anchura: "30",
    largo: "10",
    Descripcion: "Tela de prueba para la gestión del componente administrativo",
    status: "Activo",
    precioHistorico: "30",
  },
];

export function GestionRetazo() {
  /* ---------- ESTADOS PRINCIPALES ---------- */
  const [retazos, setRetazos] = useState(RetazosEjemplo); // 🔴 useState([]) cuando conectes backend
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  /* ---------- ESTADOS MODALES ---------- */
  const [modalForm, setModalForm] = useState(false); // abre/cierra form
  const [modalDel, setModalDel] = useState(false); // abre/cierra delete
  const [retazoActivo, setRetazoActivo] = useState(null); // registro a editar o eliminar

  /* ---------- HELPERS ---------- */
  const retazosFiltrados = retazos.filter((r) =>
    Object.values(r).some((val) =>
      String(val).toLowerCase().includes(filtro.toLowerCase()),
    ),
  );

  const totalPaginas = Math.ceil(retazosFiltrados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const retazosPaginados = retazosFiltrados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas)
      setPaginaActual(nuevaPagina);
  };

  const token = localStorage.getItem("access");

  const fetchRetazos = async () => {
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
        setRetazos(data);
      }
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  useEffect(() => {
    fetchRetazos();
  }, []);

  /* ---------- CRUD LOCAL (simulado) ---------- */
  const handleSave = (form) => {
    if (form.id) {
      // EDITAR
      setRetazos((prev) =>
        prev.map((r) => (r.id === form.id ? { ...form } : r)),
      );
    } else {
      // NUEVO
      form.id = String(Date.now());
      setRetazos((prev) => [...prev, form]);
    }
    setModalForm(false);
    setRetazoActivo(null);
  };

  const handleDelete = (id) => {
    setRetazos((prev) => prev.filter((r) => r.id !== id));
    setModalDel(false);
    setRetazoActivo(null);
  };

  /* ---------- EXPORT ---------- */
  const exportarExcel = () => console.log("Exportando retazos a Excel...");
  const exportarPDF = () => console.log("Exportando retazos a PDF...");

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen flex flex-col relative bg-gray-900 text-white">
      {/* FONDO */}
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
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Gestor de Retazos</h1>
            <p className="text-gray-300 text-lg">
              Administración de inventario de retazos
            </p>
          </div>
          {/* BARRA SUPERIOR */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por ID, vendedora, tipo, precio, descripción, status..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => {
                setRetazoActivo(null); // limpia por si antes se editó
                setModalForm(true);
              }}
              className="bg-gradient-to-r from-white to-white text-black px-3 py-3 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg"
            >
              + Registrar
            </button>
            <ButtonExp
              onExportExcel={exportarExcel}
              onExportPDF={exportarPDF}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retazosPaginados.map((r) => (
              <div
                key={r.id}
                className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 hover:border-[#ec4444] transition"
              >
                {/* HEADER TARJETA */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{r.tipoDeTela}</h3>
                    <p className="text-gray-300 text-sm">
                      Vendedora: {r.Vendedora}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Activo"
                        ? "bg-green-500/20 text-green-300 border border-green-500/50"
                        : "bg-red-500/20 text-red-300 border border-red-500/50"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                {/* DATOS */}
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">ID:</span> {r.id}
                  </p>
                  <p>
                    <span className="text-gray-400">Anchura:</span> {r.anchura}{" "}
                    cm
                  </p>
                  <p>
                    <span className="text-gray-400">Largo:</span> {r.largo} cm
                  </p>
                  <p>
                    <span className="text-gray-400">Precio histórico:</span> $
                    {r.precioHistorico}
                  </p>
                  <p>
                    <span className="text-gray-400">Descripción:</span>{" "}
                    {r.Descripcion}
                  </p>

                  <img src={Image} className="w-full h-auto rounded-lg" />
                </div>

                {/* BOTONES EDIC / ELIM */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      setRetazoActivo(r);
                      setModalForm(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded text-sm transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setRetazoActivo(r);
                      setModalDel(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-3 rounded text-sm transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* SIN RESULTADOS */}
          {!retazosFiltrados.length && (
            <div className="text-center py-12 text-gray-400">
              No se encontraron retazos.
            </div>
          )}
          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-[#3a3b3c] hover:bg-[#4a4b4c] rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (n) => (
                  <button
                    key={n}
                    onClick={() => cambiarPagina(n)}
                    className={`px-3 py-2 rounded-lg ${
                      paginaActual === n
                        ? "bg-red-600"
                        : "bg-[#3a3b3c] hover:bg-[#4a4b4c]"
                    }`}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-[#3a3b3c] hover:bg-[#4a4b4c] rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ---------- MODAL FORM (CREAR / EDITAR) ---------- */}
      {modalForm && (
        <ModalForm
          retazo={retazoActivo}
          onClose={() => setModalForm(false)}
          onSave={handleSave}
        />
      )}

      {/* ---------- MODAL DELETE ---------- */}
      {modalDel && (
        <ModalDel
          retazo={retazoActivo}
          onClose={() => setModalDel(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

/* ==========================================================
   COMPONENTES MODALES ( mismo archivo o separalos si quieres )
   ========================================================== */

function ModalForm({ retazo, onClose, onSave }) {
  const [form, setForm] = useState({
    id: retazo?.id || "",
    Vendedora: retazo?.Vendedora || "",
    tipoDeTela: retazo?.tipoDeTela || "",
    anchura: retazo?.anchura || "",
    largo: retazo?.largo || "",
    Descripcion: retazo?.Descripcion || "",
    status: retazo?.status || "Activo",
    precioHistorico: retazo?.precioHistorico || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#2a2b2c] border border-gray-600 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {retazo ? "Editar Retazo" : "Nuevo Retazo"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { lbl: "Vendedora", name: "Vendedora" },
            { lbl: "Tipo de Tela", name: "tipoDeTela" },
            { lbl: "Anchura (cm)", name: "anchura", type: "number" },
            { lbl: "Largo (cm)", name: "largo", type: "number" },
            {
              lbl: "Precio Histórico",
              name: "precioHistorico",
              type: "number",
            },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm mb-1 text-gray-300">
                {f.lbl}
              </label>
              <input
                name={f.name}
                type={f.type || "text"}
                value={form[f.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#262729] border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Descripción
            </label>
            <textarea
              name="Descripcion"
              value={form.Descripcion}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-[#262729] border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Estado</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#262729] border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalDel({ retazo, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#2a2b2c] border border-gray-600 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Confirmar Eliminación</h2>
        <p className="text-gray-300 mb-4">
          ¿Seguro que deseas eliminar el retazo{" "}
          <span className="text-white font-semibold">ID {retazo.id}</span>?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(retazo.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded transition"
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
