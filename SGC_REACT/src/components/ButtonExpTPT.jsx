import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
// CORRECCIÓN: Importamos autoTable explícitamente
import { autoTable } from "jspdf-autotable";

export function ButtonExpTPT() {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        alert("No se encontró el token de acceso. Inicia sesión nuevamente.");
        return [];
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(
        "http://127.0.0.1:8000/api/inventory/scraps/",
        config,
      );
      return response.data;
    } catch (error) {
      console.error("Error al conectar:", error);
      if (error.response && error.response.status === 401) {
        alert("Error 401: No autorizado. Tu token podría haber expirado.");
      } else {
        alert("Error al obtener los datos de los retazos.");
      }
      return [];
    }
  };

  const handleExportExcel = async () => {
    setLoading(true);
    const data = await fetchData();

    if (data && data.length > 0) {
      // --- PASO 1: Procesar los datos antes de pasarlos a Excel ---
      const dataProcesada = data.map((item) => {
        const itemCopia = { ...item };

        // 1. Transformación de Booleano a Texto para 'active'
        if (itemCopia.active === true) {
          itemCopia.active = "activo";
        } else {
          // Si es false, undefined o null, ponemos "inactivo"
          itemCopia.active = "inactivo";
        }

        // 2. Corrección para evitar [object Object] en Excel (si aplica)
        if (
          itemCopia.fabric_type &&
          typeof itemCopia.fabric_type === "object"
        ) {
          itemCopia.fabric_type =
            itemCopia.fabric_type.id || itemCopia.fabric_type.Fabric_Type_id;
        }
        if (
          itemCopia.fabric_type_id &&
          typeof itemCopia.fabric_type_id === "object"
        ) {
          itemCopia.fabric_type_id =
            itemCopia.fabric_type_id.id ||
            itemCopia.fabric_type_id.Fabric_Type_id;
        }

        return itemCopia;
      });

      // --- PASO 2: Crear el Excel con los datos ya procesados ---
      const worksheet = XLSX.utils.json_to_sheet(dataProcesada);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Retazos");
      XLSX.writeFile(workbook, "Retazos.xlsx");
    }

    setLoading(false);
  };

  const handleExportPDF = async () => {
    setLoading(true);
    const data = await fetchData();

    if (data && data.length > 0) {
      const doc = new jsPDF({ orientation: "landscape" });
      doc.text("Reporte de Retazos", 14, 15);
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 22);

      // --- PASO 1: Procesar y limpiar los datos ---
      const dataProcesada = data.map((item) => {
        const itemCopia = { ...item };

        // 1. Corrección de [object Object] para fabric_type
        if (
          itemCopia.fabric_type &&
          typeof itemCopia.fabric_type === "object"
        ) {
          itemCopia.fabric_type =
            itemCopia.fabric_type.id || itemCopia.fabric_type.Fabric_Type_id;
        }
        if (
          itemCopia.fabric_type_id &&
          typeof itemCopia.fabric_type_id === "object"
        ) {
          itemCopia.fabric_type_id =
            itemCopia.fabric_type_id.id ||
            itemCopia.fabric_type_id.Fabric_Type_id;
        }

        // 2. Transformación de Booleano a Texto para 'active'
        if (itemCopia.active === true) {
          itemCopia.active = "activo";
        } else {
          // Si es false o undefined, ponemos "inactivo" (o vacío "" si prefieres)
          itemCopia.active = "inactivo";
        }

        return itemCopia;
      });

      // --- PASO 2: Crear la tabla ---
      const tableColumn = Object.keys(dataProcesada[0]);
      const tableRows = dataProcesada.map((row) => Object.values(row));

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
      });

      doc.save("Retazos.pdf");
    }

    setLoading(false);
  };

  return (
    <div className="flex gap-3 ">
      <button
        onClick={handleExportExcel}
        disabled={loading}
        className={`bg-gradient-to-r  from-[#68bf74]/80 to-[#68bf74] hover:from-[#5aaf64] hover:to-[#5aaf64] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300  hover:brightness-110 shadow-lg flex items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          className="bi bi-file-earmark-excel"
          viewBox="0 0 16 16"
        >
          <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
        </svg>
        {loading ? "Exportando..." : "Excel"}
      </button>

      <button
        onClick={handleExportPDF}
        disabled={loading}
        className={`bg-gradient-to-r from-[#3a3b3c]/70 to-[#3a3b3c]/70 hover:from-[#4a4b4c] hover:to-[#4a4b4c]/70 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:brightness-110 shadow-lg flex items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          className="bi bi-file-earmark-pdf-fill"
          viewBox="0 0 16 16"
        >
          <path d="M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z" />
          <path
            fillRule="evenodd"
            d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"
          />
        </svg>
        {loading ? "Exportando..." : "PDF"}
      </button>
    </div>
  );
}
