import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Chart from "chart.js/auto";
//instalar npm install chart.js
export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // Referencias a los Canvas
  const vendedorCanvasRef = React.useRef(null); // Gráfico 1: Barras (Vendedoras)
  const tipoTelaCanvasRef = React.useRef(null); // Gráfico 2: Barras (Tipos de Tela)
  const progresoCanvasRef = React.useRef(null); // Gráfico 3: Línea

  // Referencias a las instancias para destruirlas
  const vendedorChartInstance = React.useRef(null);
  const tipoTelaChartInstance = React.useRef(null);
  const progresoChartInstance = React.useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token) return;
        const response = await fetch(
          "http://127.0.0.1:8000/api/inventory/dashboard/metrics/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error("Error al cargar dashboard");
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading && dashboardData) {
      
      // --- 1. DATOS PARA GRÁFICA BARRAS: VENDEDORAS (Nombre vs Retazos) ---
      // ✅ USAMOS LA CLAVE CORRECTA: created_by__username
      const vendedorData = dashboardData.data2?.ranking_global || [];
      const vendedorLabels = vendedorData.map((item) => item.created_by__username);
      const vendedorValues = vendedorData.map((item) => Number(item.total) || 0);

      // --- 2. DATOS PARA GRÁFICA BARRAS: TIPOS DE TELA (Nombre vs Retazos) ---
      // ✅ USAMOS LA CLAVE CORRECTA: fabric_type__name
      const telaData = dashboardData.data1?.scraps_by_type || [];
      const telaLabels = telaData.map((item) => item.fabric_type__name);
      const telaValues = telaData.map((item) => Number(item.total) || 0);

      // --- 3. DATOS PARA GRÁFICA LÍNEA: PROGRESO SEMANAL ---
      const progresoData = dashboardData.data2?.progreso_semanal || [];
      const progresoGrouped = progresoData.reduce((acc, curr) => {
        // Extraemos la fecha limpia
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

      // Configuración visual global
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
          x: {
            ticks: { color: "#9ca3af" },
            grid: { color: "#4a4b4c" }
          },
          y: {
            ticks: { color: "#9ca3af" },
            grid: { color: "#4a4b4c" },
            beginAtZero: true
          }
        }
      };

      // --- CREACIÓN DE GRÁFICAS ---

      // GRÁFICA 1: BARRAS (Vendedoras)
      if (vendedorCanvasRef.current) {
        if (vendedorChartInstance.current) vendedorChartInstance.current.destroy();
        vendedorChartInstance.current = new Chart(vendedorCanvasRef.current, {
          type: "bar",
          data: {
            labels: vendedorLabels,
            datasets: [{
              label: "Retazos Registrados",
              data: vendedorValues,
              backgroundColor: "#e30713",
              borderRadius: 8
            }]
          },
          options: commonOptions
        });
      }

      // GRÁFICA 2: BARRAS (Tipos de Tela)
      if (tipoTelaCanvasRef.current) {
        if (tipoTelaChartInstance.current) tipoTelaChartInstance.current.destroy();
        tipoTelaChartInstance.current = new Chart(tipoTelaCanvasRef.current, {
          type: "bar",
          data: {
            labels: telaLabels,
            datasets: [{
              label: "Retazos por Tipo",
              data: telaValues,
              backgroundColor: "#ec4444",
              borderRadius: 8
            }]
          },
          options: commonOptions
        });
      }

      // GRÁFICA 3: LÍNEA (Progreso)
      if (progresoCanvasRef.current) {
        if (progresoChartInstance.current) progresoChartInstance.current.destroy();
        progresoChartInstance.current = new Chart(progresoCanvasRef.current, {
          type: "line",
          data: {
            labels: lineLabels,
            datasets: [{
              label: "Retazos Agregados",
              data: lineValues,
              borderColor: "#ff6b6b",
              backgroundColor: "rgba(255, 107, 107, 0.2)",
              borderWidth: 3,
              tension: 0.3,
              pointRadius: 5,
              fill: true
            }]
          },
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
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(216, 68, 68, 0.6), rgba(30, 30, 42, 0.95)), url('/src/assets/wallpaper.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <main className="relative z-10 flex-1 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white mb-4">
                Dashboard de Métricas
              </h1>
              <p className="text-gray-300 text-lg">
                Análisis de vendedoras y tipos de tela
              </p>
            </div>

            {loading ? (
              <div className="text-center text-white py-20 text-xl">
                Cargando métricas...
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* GRÁFICA 1: RANKING VENDEDORAS (BARRAS) */}
                <div className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center h-[400px]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full text-center">
                    Ranking por Vendedora
                  </h3>
                  <div className="w-full h-full relative">
                    <canvas ref={vendedorCanvasRef}></canvas>
                  </div>
                </div>

                {/* GRÁFICA 2: RETAZOS POR TIPO DE TELA (BARRAS) */}
                <div className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center h-[400px]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full text-center">
                    Retazos por Tipo de Tela
                  </h3>
                  <div className="w-full h-full relative">
                    <canvas ref={tipoTelaCanvasRef}></canvas>
                  </div>
                </div>

                {/* GRÁFICA 3: PROGRESO SEMANAL (LÍNEA) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center h-[400px]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full text-center">
                    Progreso Semanal
                  </h3>
                  <div className="w-full h-full relative">
                    <canvas ref={progresoCanvasRef}></canvas>
                  </div>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}