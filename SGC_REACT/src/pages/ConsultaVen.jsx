import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Image from "../assets/QR.png";
import { ButtonExpTPT } from "../components/ButtonExpTPT";
import { NavbarVen } from "../components/NavbarVen";

export function ConsultaVen() {
  // --- Estados existentes ---
  const [retazos, setRetazos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedRetazos, setSelectedRetazos] = useState([]);
  const [mostrarFactura, setMostrarFactura] = useState(false);

  // --- Estados para PDF ---
  const [pdfUrl, setPdfUrl] = useState(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);

  const elementosPorPagina = 6;
  const token = localStorage.getItem("access");

  // --- Fetch de Retazos ---
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
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // --- Lógica de Selección ---
  const toggleSelection = (retazo) => {
    setSelectedRetazos((prev) => {
      const existe = prev.find(
        (r) => r.fabric_scrap_id === retazo.fabric_scrap_id,
      );
      if (existe) {
        return prev.filter((r) => r.fabric_scrap_id !== retazo.fabric_scrap_id);
      } else {
        return [...prev, retazo];
      }
    });
  };

  const eliminarRetazoDeLista = (retazo) => {
    toggleSelection(retazo);
  };

  const isSelected = (id) => {
    return selectedRetazos.some((r) => r.fabric_scrap_id === id);
  };

  // --- Lógica de Facturación ---
  const calcularPrecioRetazo = (retazo) => {
    const area = (retazo.width_meters || 0) * (retazo.length_meters || 0);
    const precioPorMetroCuadrado = 10.0;
    return area * precioPorMetroCuadrado;
  };

  const getTotalFactura = () => {
    return selectedRetazos.reduce((total, retazo) => {
      return total + calcularPrecioRetazo(retazo);
    }, 0);
  };

  // --- FUNCIÓN PARA GENERAR PDF ---
  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FACTURA PROFORMA", pageWidth / 2, y, { align: "center" });
    y += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: 10/CLIENTE GENERAL`, margin, y);
    doc.text(
      `Fecha: ${new Date().toLocaleDateString()}`,
      pageWidth - margin,
      y,
      { align: "right" },
    );
    y += 10;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    selectedRetazos.forEach((item) => {
      const precio = calcularPrecioRetazo(item).toFixed(2);
      const descripcion = `${item.fabric_type?.name || "Tela"} ${item.description ? `- ${item.description}` : ""}`;
      const medidas = `${item.length_meters}m x ${item.width_meters}m`;

      doc.setFont("helvetica", "bold");
      doc.text(`${item.fabric_scrap_id}/`, margin, y);

      doc.setFont("helvetica", "normal");
      const splitDesc = doc.splitTextToSize(`${descripcion} ${medidas}`, 120);
      doc.text(splitDesc, margin + 15, y);

      doc.text(`$${precio}`, pageWidth - margin, y, { align: "right" });

      y += splitDesc.length * 7 + 5;

      doc.setDrawColor(200);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
    });

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL A PAGAR:", pageWidth - 60, y, { align: "right" });
    doc.text(`$ ${getTotalFactura().toFixed(2)}`, pageWidth - margin, y, {
      align: "right",
    });

    y += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Este documento no es una factura fiscal válida. Es una proforma de venta.",
      margin,
      y,
    );

    const pdfBlob = doc.output("bloburl");
    setPdfUrl(pdfBlob);
    setMostrarPreview(true);
  };

  const handleImprimir = () => {
    generarPDF();
  };

  const handleConfirmarVenta = () => {
    alert("Venta confirmada exitosamente");
    setSelectedRetazos([]);
    setMostrarFactura(false);
    setPaginaActual(1);
  };

  const handleDescargarPDF = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "Factura_Proforma.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filtrado ---
  const retazosFiltrados = retazos.filter((retazo) => {
    const termino = filtro.toLowerCase();
    const id = String(retazo.fabric_scrap_id || "");
    const tipoTela = String(
      retazo.fabric_type?.name || retazo.fabric_type_id || "",
    );
    const descripcion = String(retazo.description || "");
    const rol = String(retazo.created_by_role || "");
    const creadorId = String(retazo.created_by || "");

    return (
      id.includes(termino) ||
      tipoTela.toLowerCase().includes(termino) ||
      descripcion.toLowerCase().includes(termino) ||
      rol.toLowerCase().includes(termino) ||
      creadorId.includes(termino)
    );
  });

  const totalPaginas = Math.ceil(retazosFiltrados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const retazosPaginados = retazosFiltrados.slice(
    indiceInicio,
    indiceInicio + elementosPorPagina,
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <>
      <NavbarVen />
      <div className="min-h-screen flex flex-col relative bg-gray-900">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(216, 68, 68, 0.6), rgba(30, 30, 42, 0.95)), url('/src/assets/wallpaper.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <main className="relative z-10 flex-1 px-4 py-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Consulta de Retazos
              </h1>
              <p className="text-gray-300 text-lg">
                Selecciona los retazos para generar una factura
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por ID, Tipo de tela, Descripción..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="w-full px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <ButtonExpTPT />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {retazosPaginados.map((retazo) => {
                const precio = calcularPrecioRetazo(retazo);
                return (
                  <div
                    key={retazo.fabric_scrap_id}
                    className={`bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border transition-all duration-300 relative cursor-pointer
                      ${isSelected(retazo.fabric_scrap_id) ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-600 hover:border-[#ec4444]"}
                    `}
                    onClick={() => toggleSelection(retazo)}
                  >
                    <div className="absolute top-4 right-4">
                      <div
                        className={`w-6 h-6 rounded border flex items-center justify-center ${isSelected(retazo.fabric_scrap_id) ? "bg-green-500 border-green-500" : "border-gray-400 bg-gray-800"}`}
                      >
                        {isSelected(retazo.fabric_scrap_id) && (
                          <span className="text-white font-bold">✓</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-white font-bold text-lg">
                        {retazo.fabric_scrap_id}/Retazo de{" "}
                        {retazo.fabric_type?.name ||
                          retazo.fabric_type_id ||
                          "Tipo Desconocido"}
                      </h3>
                      <p className="text-green-400 font-bold mt-1">
                        ${precio.toFixed(2)}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-ellipsis w-75">
                        <span className="text-gray-400">Ancho:</span>
                        <span className="text-white">
                          {retazo.width_meters}m
                        </span>
                      </div>
                      <div className="flex justify-between text-ellipsis w-75">
                        <span className="text-gray-400">Largo:</span>
                        <span className="text-white">
                          {retazo.length_meters}m
                        </span>
                      </div>

                      <p className="text-gray-400 text-xs mt-2 truncate">
                        {retazo.description}
                      </p>

                      <div className="mt-4 flex justify-center">
                        <img
                          src={Image}
                          alt="QR"
                          className="w-20 h-20 rounded-lg opacity-80"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {retazosFiltrados.length === 0 && (
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
                  className="px-4 py-2 bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-white">
                  Página {paginaActual} de {totalPaginas}
                </span>
                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </main>

        {selectedRetazos.length > 0 && (
          <div className="fixed bottom-8 right-8 z-40 animate-bounce">
            <button
              onClick={() => setMostrarFactura(true)}
              className="bg-red-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Ver Factura ({selectedRetazos.length})
            </button>
          </div>
        )}

        {/* Modal de Resumen de Factura (RESPONSIVE) */}
        {mostrarFactura && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 md:p-4 backdrop-blur-sm">
            <div className="bg-[#3e3d3d] w-full h-full md:h-auto md:max-w-3xl md:max-h-[90vh] flex flex-col overflow-hidden relative">
              {/* Header Factura */}
              <div className="bg-grey-700 p-4 md:p-6 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Resumen de Venta
                  </h2>
                  <p className="text-white text-xs md:text-sm">
                    Fecha: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs md:text-sm">
                    Total a Pagar
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-green-400">
                    ${getTotalFactura().toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Área de Contenido Scrollable */}
              <div className="flex-1 overflow-y-auto bg-gray-500 p-0 relative">
                {/* --- VISTA ESCRITORIO (Tabla) --- */}
                <div className="hidden md:block w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-200 sticky top-0">
                      <tr className="text-gray-700 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-semibold">ID</th>
                        <th className="px-6 py-3 font-semibold">
                          Descripción/Tela
                        </th>
                        <th className="px-6 py-3 font-semibold text-right">
                          Medidas
                        </th>
                        <th className="px-6 py-3 font-semibold text-right">
                          Precio
                        </th>
                        <th className="px-6 py-3 font-semibold text-center">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedRetazos.map((item, index) => (
                        <tr
                          key={item.fabric_scrap_id}
                          className={`hover:bg-red-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            #{item.fabric_scrap_id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.fabric_type?.name || "Tela"}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-xs">
                              {item.description || "Sin descripción"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-600 whitespace-nowrap">
                            {item.width_meters}m x {item.length_meters}m
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 whitespace-nowrap">
                            ${calcularPrecioRetazo(item).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => eliminarRetazoDeLista(item)}
                              className="text-red-400 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* --- VISTA MÓVIL (Tarjetas/Cards) --- */}
                <div className="block md:hidden p-4 space-y-4">
                  {selectedRetazos.map((item) => (
                    <div
                      key={item.fabric_scrap_id}
                      className="bg-[#3e3d3d] rounded-lg shadow-sm border border-gray-200 p-4 relative"
                    >
                      {/* Header Card: ID + Boton Eliminar */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs text-white font-bold uppercase">
                            ID
                          </span>
                          <div className="text-white font-bold text-lg">
                            #{item.fabric_scrap_id}
                          </div>
                        </div>
                        <button
                          onClick={() => eliminarRetazoDeLista(item)}
                          className="text-red-500 bg-red-50 p-2 rounded-full hover:bg-red-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Descripción */}
                      <div className="mb-3">
                        <span className="text-xs text-white font-bold uppercase block">
                          Tela
                        </span>
                        <div className="font-medium text-white">
                          {item.fabric_type?.name || "Desconocida"}
                        </div>
                        {item.description && (
                          <div className="text-sm text-white mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>

                      {/* Medidas y Precio */}
                      <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-2">
                        <div>
                          <span className="text-xs text-white font-bold uppercase block">
                            Medidas
                          </span>
                          <div className="text-sm text-white">
                            {item.width_meters}m x {item.length_meters}m
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-white font-bold uppercase block">
                            Precio
                          </span>
                          <div className="text-xl font-bold text-green-600">
                            ${calcularPrecioRetazo(item).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedRetazos.length === 0 && (
                    <div className="text-center py-8 text-white">
                      No hay retazos seleccionados.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Factura (Botones) */}
              <div className="p-4 w-full md:p-6 bg-black-500 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center shrink-0 gap-4">
                <button
                  onClick={() => setMostrarFactura(false)}
                  className="w-full md:w-full text-white hover:text-blue-500 font-medium px-6 py-3 transition-colors"
                >
                  Cancelar
                </button>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-full">
                  <button
                    onClick={handleImprimir}
                    disabled={selectedRetazos.length === 0}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Imprimir
                  </button>

                  <button
                    onClick={handleConfirmarVenta}
                    disabled={selectedRetazos.length === 0}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-800 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Confirmar Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Vista Previa PDF */}
        {mostrarPreview && pdfUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-2 md:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden">
              {/* Header Preview */}
              <div className="bg-gray-800 p-4 flex justify-between items-center shrink-0">
                <h3 className="text-white font-bold text-lg">
                  Vista Previa PDF
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setMostrarPreview(false);
                      setPdfUrl(null);
                    }}
                    className="text-white hover:text-gray-300 font-bold text-xl px-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Iframe PDF Viewer */}
              <div className="flex-1 bg-gray-500 overflow-hidden">
                <iframe
                  src={pdfUrl}
                  title="Vista Previa PDF"
                  className="w-full h-full border-none"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
