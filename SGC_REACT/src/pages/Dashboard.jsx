import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Chart from "chart.js/auto";
import { getDashboardMetrics } from "../api/tasks.api";

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referencias
  const vendedorCanvasRef = React.useRef(null);
  const tipoTelaCanvasRef = React.useRef(null);
  const progresoCanvasRef = React.useRef(null);

  const vendedorChartInstance = React.useRef(null);
  const tipoTelaChartInstance = React.useRef(null);
  const progresoChartInstance = React.useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardMetrics();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  useEffect(() => {
    if (!loading && dashboardData) {
      
      //1. DATOS PARA GRÁFICA BARRAS: VENDEDORAS 
      const vendedorData = dashboardData.data2?.ranking_global || [];
      const vendedorLabels = vendedorData.map((item) => item.created_by__username);
      const vendedorValues = vendedorData.map((item) => Number(item.total) || 0);

      // 2. DATOS PARA GRÁFICA BARRAS: TIPOS DE TELA
      const telaData = dashboardData.data1?.scraps_by_type || [];
      const telaLabels = telaData.map((item) => item.fabric_type__name);
      const telaValues = telaData.map((item) => Number(item.total) || 0);

      //3. DATOS PARA GRÁFICA LÍNEA: PROGRESO SEMANAL
      const progresoData = dashboardData.data2?.progreso_semanal || [];
      const progresoGrouped = progresoData.reduce((acc, curr) => {
        const dateKey = curr.semana ? curr.semana.split("T")[0] : "Desconocido";
        const val = Number(curr.total) || 0;
        if (acc[dateKey]) {
          acc[dateKey] += val;
        } else {
          acc[dateKey] = val;
        }
        return acc;
      }, {});

      const lineLabels = Object.keys(progresoGrouped);
      const lineValues = Object.values(progresoGrouped);

      const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "white" } },
          tooltip: {
            backgroundColor: "#1e1e2a",
            titleColor: "#fff",
            bodyColor: "#fff"
          }
        },
        scales: {
          x: { ticks: { color: "#9ca3af" }, grid: { color: "#4a4b4c" } },
          y: { ticks: { color: "#9ca3af" }, grid: { color: "#4a4b4c" }, beginAtZero: true }
        }
      };

      // GRÁFICA 1
      if (vendedorCanvasRef.current) {
        if (vendedorChartInstance.current) vendedorChartInstance.current.destroy();
        vendedorChartInstance.current = new Chart(vendedorCanvasRef.current, {
          type: "bar",
          data: { labels: vendedorLabels, datasets: [{ label: "Retazos Registrados", data: vendedorValues, backgroundColor: "#e30713", borderRadius: 8 }] },
          options: commonOptions
        });
      }

      // GRÁFICA 2
      if (tipoTelaCanvasRef.current) {
        if (tipoTelaChartInstance.current) tipoTelaChartInstance.current.destroy();
        tipoTelaChartInstance.current = new Chart(tipoTelaCanvasRef.current, {
          type: "bar",
          data: { labels: telaLabels, datasets: [{ label: "Retazos por Tipo", data: telaValues, backgroundColor: "#ec4444", borderRadius: 8 }] },
          options: commonOptions
        });
      }

      // GRÁFICA 3
      if (progresoCanvasRef.current) {
        if (progresoChartInstance.current) progresoChartInstance.current.destroy();
        progresoChartInstance.current = new Chart(progresoCanvasRef.current, {
          type: "line",
          data: { labels: lineLabels, datasets: [{ label: "Retazos Agregados", data: lineValues, borderColor: "#ff6b6b", backgroundColor: "rgba(255, 107, 107, 0.2)", borderWidth: 3, tension: 0.3, pointRadius: 5, fill: true }] },
          options: commonOptions
        });
      }
    }

    return () => {
      if (vendedorChartInstance.current) vendedorChartInstance.current.destroy();
      if (tipoTelaChartInstance.current) tipoTelaChartInstance.current.destroy();
      if (progresoChartInstance.current) progresoChartInstance.current.destroy();
    };
  }, [loading, dashboardData]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col relative bg-gray-900">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `linear-gradient(rgba(216, 68, 68, 0.6), rgba(30, 30, 42, 0.95)), url('/src/assets/wallpaper.png')`, backgroundSize: "cover", backgroundPosition: "center", }} />
        <main className="relative z-10 flex-1 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white mb-4">Dashboard de Métricas</h1>
              <p className="text-gray-300 text-lg">Análisis de vendedoras y tipos de tela</p>
            </div>
            {loading ? (
              <div className="text-center text-white py-20 text-xl">Cargando métricas...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-20 text-xl">{error}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Graficas */}
                <div className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center h-[400px]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full text-center">Ranking por Vendedora</h3>
                  <div className="w-full h-full relative"><canvas ref={vendedorCanvasRef}></canvas></div>
                </div>
                <div className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center h-[400px]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full text-center">Retazos por Tipo de Tela</h3>
                  <div className="w-full h-full relative"><canvas ref={tipoTelaCanvasRef}></canvas></div>
                </div>
                <div className="lg:col-span-2 bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center h-[400px]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full text-center">Progreso Semanal</h3>
                  <div className="w-full h-full relative"><canvas ref={progresoCanvasRef}></canvas></div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}