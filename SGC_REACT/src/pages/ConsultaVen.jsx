import React, { useState, useEffect, useRef, useCallback } from "react";
import jsPDF from "jspdf";
import { ButtonExpTPT } from "../components/ButtonExpTPT";
import { NavbarVen } from "../components/NavbarVen";
import toast, { Toaster } from "react-hot-toast";
import { SecureImage } from "../components/SecureImage";
import { Html5Qrcode } from "html5-qrcode";

export function ConsultaVen() {
  const [retazos, setRetazos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedRetazos, setSelectedRetazos] = useState([]);
  const [mostrarFactura, setMostrarFactura] = useState(false);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [mostrarScanner, setMostrarScanner] = useState(false);

  const scannerRef = useRef(null);
  const retazosRef = useRef(retazos);
  const selectedRetazosRef = useRef(selectedRetazos);

  const elementosPorPagina = 6;
  const token = localStorage.getItem("access");

  // --- Sincronizar Refs ---
  useEffect(() => {
    retazosRef.current = retazos;
    selectedRetazosRef.current = selectedRetazos;
  }, [retazos, selectedRetazos]);

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
        const retazosActivos = data.filter((retazo) => retazo.active !== 0);
        setRetazos(retazosActivos);
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

  const getTotalFactura = () => {
    return selectedRetazos.reduce((total, retazo) => {
      return total + calcularPrecioRetazo(retazo);
    }, 0);
  };

  // --- LÓGICA DEL ESCÁNER CORREGIDA ---

  const onScanFailure = useCallback((error) => {
    // Ignorar errores de no encontrar QR
  }, []);

  const handleScanSuccess = useCallback((decodedText) => {
    console.log("✅ QR ESCANEADO:", decodedText);

    const idEscaneado = String(decodedText).trim();
    const retazoEncontrado = retazosRef.current.find(
      (r) => String(r.fabric_scrap_id) === idEscaneado,
    );

    if (retazoEncontrado) {
      const yaSeleccionado = selectedRetazosRef.current.some(
        (r) => r.fabric_scrap_id === retazoEncontrado.fabric_scrap_id,
      );

      if (!yaSeleccionado) {
        toggleSelection(retazoEncontrado);
        toast.success(`Retazo #${idEscaneado} agregado.`);

        // --- FIX CRÍTICO ---
        // Detener el escáner explícitamente ANTES de cerrar el modal
        // para evitar que intente limpiar un DOM que ya no existe
        if (scannerRef.current) {
          scannerRef.current
            .stop()
            .then(() => {
              scannerRef.current.clear();
            })
            .catch((err) => console.log("Error apagando escáner", err));
        }
        // ---------------------

        setMostrarScanner(false);
      } else {
        toast(`Retazo #${idEscaneado} ya está en la lista.`);

        // Mismo fix si ya estaba seleccionado
        if (scannerRef.current) {
          scannerRef.current
            .stop()
            .then(() => {
              scannerRef.current.clear();
            })
            .catch((err) => console.log("Error apagando escáner", err));
        }
        setMostrarScanner(false);
      }
    } else {
      toast.error(`ID ${idEscaneado} no encontrado.`);
    }
  }, []);

  // Efecto para iniciar el escáner
  useEffect(() => {
    if (mostrarScanner) {
      const timeoutId = setTimeout(() => {
        const readerElement = document.getElementById("reader");
        if (!readerElement) {
          toast.error("Error: Contenedor de video no encontrado.");
          return;
        }

        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        // Configuración que funcionó
        const config = {
          fps: 5,
          qrbox: { width: 500, height: 500 },
          aspectRatio: 1.0,
        };

        scanner
          .start(
            { facingMode: "environment" },
            config,
            handleScanSuccess,
            onScanFailure,
          )
          .catch((err) => {
            console.error("Error CRÍTICO al iniciar cámara", err);
            toast.error("No se pudo iniciar la cámara.");
          });
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // Limpieza defensiva para el botón de cerrar (X)
      // Usamos try-catch para evitar crash de pantalla blanca si el estado ya cambió
      if (scannerRef.current) {
        try {
          scannerRef.current
            .stop()
            .then(() => {
              scannerRef.current.clear().catch(() => {}); // Ignorar error de clear
            })
            .catch(() => {}); // Ignorar error de stop
        } catch (e) {
          console.warn("Error en cleanup:", e);
        }
      }
    }
  }, [mostrarScanner, handleScanSuccess, onScanFailure]);

  // --- GENERADOR PDF ---
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

  // --- CONFIRMAR VENTA ---
  const handleConfirmarVenta = async () => {
    const ids = selectedRetazos.map((r) => r.fabric_scrap_id);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/inventory/confirmar-venta/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            scrap_ids: ids,
          }),
        },
      );

      if (response.ok) {
        toast.success("Venta confirmada exitosamente");
        setSelectedRetazos([]);
        setMostrarFactura(false);
        setPaginaActual(1);
        await fetchRetazos();
      } else {
        console.error("Error en la respuesta del servidor");
        toast.error("Hubo un error al confirmar la venta.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      toast.error("Error de conexión al intentar confirmar la venta.");
    }
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

  const calcularPrecioRetazo = (retazo) => {
    const area = (retazo.width_meters || 0) * (retazo.length_meters || 0);
    const precioPorMetroCuadrado = retazo.fabric_type?.price_unit;
    return area * precioPorMetroCuadrado;
  };

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
      <Toaster />
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

              <button
                onClick={() => setMostrarScanner(true)}
                className="bg-[#ec4444] hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                Escanear QR
              </button>
            </div>

            <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {retazosPaginados.map((retazo) => {
                const precio = calcularPrecioRetazo(retazo);
                return (
                  <div
                    key={retazo.fabric_scrap_id}
                    className={`bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-8 border transition-all duration-300 relative cursor-pointer 
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
                      <div className="flex justify-between ">
                        <div>
                          <span className="text-gray-400">Creador:</span>{" "}
                          <span className="text-white">
                            <span className="text-white">
                              {retazo.created_by}
                            </span>
                          </span>
                        </div>
                        <span>
                          <span className="text-gray-400">Rol:</span>{" "}
                          <span className="text-white">
                            {retazo.created_by_role}
                          </span>
                        </span>
                      </div>

                      <div className="flex justify-between ">
                        <span>
                          <span className="text-gray-400">Ancho (metro):</span>{" "}
                          <span className="text-white">
                            {retazo.width_meters}
                          </span>
                        </span>
                        <div>
                          <span className="text-gray-400">Largo (metro):</span>{" "}
                          <span className="text-white">
                            {retazo.length_meters}
                          </span>
                        </div>
                      </div>

                      <p className="break-words">
                        <span className="text-gray-400">Descripcion:</span>{" "}
                        <br />
                        <span className="text-white">{retazo.description}</span>
                      </p>
                      <div className="mt-4 flex justify-center">
                        <SecureImage
                          id={retazo.fabric_scrap_id}
                          className="w-80 h-80 rounded-lg opacity-80 object-contain"
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

        {/* MODAL ESCÁNER */}
        {mostrarScanner && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <div className="bg-[#3e3d3d] rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
              <div className="bg-[#262729] p-4 flex justify-between items-center border-b border-gray-600">
                <h3 className="text-white font-bold text-lg">
                  Escanear Retazo
                </h3>
                <button
                  onClick={() => setMostrarScanner(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 bg-black flex flex-col items-center justify-center h-[400px] relative">
                <div className="w-full h-full overflow-hidden rounded-lg border-2 border-red-500 relative">
                  <div
                    id="reader"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "300px",
                      position: "relative",
                    }}
                  ></div>
                </div>
                <p className="text-white mt-2 text-sm text-center opacity-80">
                  Acerca el QR unos 15cm a la cámara
                </p>
              </div>
            </div>
          </div>
        )}

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

              <div className="flex-1 overflow-y-auto bg-gray-500 p-0 relative">
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

                <div className="block md:hidden p-4 space-y-4">
                  {selectedRetazos.map((item) => (
                    <div
                      key={item.fabric_scrap_id}
                      className="bg-[#3e3d3d] rounded-lg shadow-sm border border-gray-200 p-4 relative"
                    >
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

        {mostrarPreview && pdfUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-2 md:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden">
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
