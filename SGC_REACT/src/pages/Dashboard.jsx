import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
// Importamos componentes de Recharts (Hemos eliminado ResponsiveContainer del import)
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianAxis,
  LineChart,
  Line,
} from "recharts";

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // Colores personalizados
  const COLORS = ["#e30713", "#ec4444", "#ff6b6b", "#8a1c1c", "#1e1e2a", "#3a3b3c"];

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

  // Preparar datos
  const scrapsByTypeData = dashboardData?.data1?.scraps_by_type?.map((item) => ({
    name: item.fabric_typename,
    value: item.total,
  })) || [];

  const rankingData = dashboardData?.data2?.ranking_global?.map((item) => ({
    name: item.created_byusername,
    total: item.total,
  })) || [];

  const weeklyProgressRaw = dashboardData?.data2?.progreso_semanal || [];
  
  const weeklyData = weeklyProgressRaw.reduce((acc, curr) => {
    const dateKey = curr.semana.split("T")[0];
    if (acc[dateKey]) {
      acc[dateKey] += curr.total;
    } else {
      acc[dateKey] = curr.total;
    }
    return acc;
  }, {});

  const chartWeeklyData = Object.keys(weeklyData).map((date) => ({
    name: date,
    Retazos: weeklyData[date],
  }));

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col relative bg-gray-900">
        {/* Fondo */}
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
                Análisis de retazos, ranking de vendedoras y progreso semanal
              </p>
            </div>

            {loading ? (
              <div className="text-center text-white py-20 text-xl">
                Cargando métricas...
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- TARJETA 1: Retazos por Tipo --- */}
                <div className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full">
                    Distribución de Retazos por Tipo
                  </h3>
                  {/* Se usa un div contenedor con overflow para manejar el tamaño fijo del gráfico */}
                  <div style={{ width: "100%", height: "320px", display: "flex", justifyContent: "center" }}>
                    {scrapsByTypeData.length > 0 ? (
                      // Se eliminó ResponsiveContainer. Se asigna width y height directo al PieChart
                      <PieChart width={400} height={300}>
                        <Pie
                          data={scrapsByTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {scrapsByTypeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e1e2a", border: "none", borderRadius: "8px", color: "#fff" }}
                        />
                      </PieChart>
                    ) : (
                      <p className="text-gray-400 text-center pt-10">No hay datos de tipos.</p>
                    )}
                  </div>
                </div>

                {/* --- TARJETA 2: Ranking Global --- */}
                <div className="bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full">
                    Ranking Global de Vendedoras
                  </h3>
                  <div style={{ width: "100%", height: "320px", display: "flex", justifyContent: "center" }}>
                    {rankingData.length > 0 ? (
                       <BarChart width={600} height={300} data={rankingData}>
                        <CartesianAxis stroke="#4a4b4c" />
                        <XAxis
                          dataKey="name"
                          stroke="#9ca3af"
                          fontSize={12}
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e1e2a", border: "none", borderRadius: "8px", color: "#fff" }}
                        />
                        <Bar dataKey="total" fill="#e30713" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    ) : (
                      <p className="text-gray-400 text-center pt-10">No hay datos de ranking.</p>
                    )}
                  </div>
                </div>

                {/* --- TARJETA 3: Progreso Semanal --- */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#3a3b3c]/90 to-[#2a2b2c]/90 rounded-xl shadow-lg p-6 border border-gray-600 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-600 pb-2 w-full">
                    Progreso Semanal (Retazos Registrados)
                  </h3>
                  <div style={{ width: "100%", height: "320px", display: "flex", justifyContent: "center" }}>
                    {chartWeeklyData.length > 0 ? (
                      <LineChart width={800} height={300} data={chartWeeklyData}>
                        <CartesianAxis stroke="#4a4b4c" />
                        <XAxis
                          dataKey="name"
                          stroke="#9ca3af"
                          fontSize={12}
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e1e2a", border: "none", borderRadius: "8px", color: "#fff" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Retazos"
                          stroke="#ec4444"
                          strokeWidth={3}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    ) : (
                      <p className="text-gray-400 text-center pt-10">No hay datos de progreso.</p>
                    )}
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