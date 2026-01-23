// BuscarRetazo.jsx
import { ButtonG } from "../components/ButtonG";
import React, { useState } from "react";

export function ConsultaVen() {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null); // datos del retazo encontrado
  const [loading, setLoading] = useState(false);

  // Simula búsqueda por ID (reemplazar con llamada real)
  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setLoading(true);

    /*
    // EJEMPLO DE LLAMADA REAL:
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/retazos/${searchId}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
    */

    // MOCK temporal ───────────────────────────────────────────
    setTimeout(() => {
      setResult({
        id: searchId,
        nombre: "15/Tela de Algodón",
        largo: "10 metros",
        ancho: "5 metros",
        precio: "50$  /  2500,45 Bs",
        descripcion:
          "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
      });
      setLoading(false);
    }, 600);
    // ──────────────────────────────────────────────────────────
  };

  const handleQrScan = (code) => {
    // Si tu lector QR devuelve solo el ID:
    setSearchId(code);
    // handleSearch(); // descomenta si quieres autobúsqueda
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

      <main className="relative z-10 flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#3a3b3c]/58 to-[#2a2b2c] rounded-xl shadow-2xl p-8 border border-[#ec4444]">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Buscar Retazo
            </h1>
            <p className="text-gray-300">
              Consulta un retazo por ID o escanea su código QR
            </p>
          </div>

          {/* Barra de búsqueda + botón QR */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ej: 15"
              className="flex-1 px-4 py-3 bg-[#262729] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={() => handleQrScan("15")} // <- reemplaza con tu lector QR real
              className="px-4 py-3 bg-[#ec4444] hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              title="Escanear QR"
            >
              {/* Icono QR simple */}
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
                  d="M12 4v1m6 11h2m-6 0h-2m0 0V9m0 6a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
              QR
            </button>
            <ButtonG onClick={handleSearch} disabled={loading} />
          </div>

          {/* Resultado */}
          {loading && <p className="text-gray-300 text-center">Buscando…</p>}

          {result && !loading && (
            <div className="mt-6 p-4 bg-[#262729] rounded-lg border border-gray-600 text-white space-y-2">
              <p className="font-semibold text-lg">{result.nombre}</p>
              <p>Largo: {result.largo}</p>
              <p>Ancho: {result.ancho}</p>
              <p>Precio: {result.precio}</p>
              <p className="text-sm text-gray-300">{result.descripcion}</p>
              <div className="pt-3 flex justify-end">
                <button className="px-4 py-2 bg-[#ec4444] hover:bg-red-600 rounded-md transition-colors">
                  Añadir a lista
                </button>
              </div>
            </div>
          )}

          {!result && !loading && searchId && (
            <p className="text-center text-gray-400 mt-4">
              No se encontró ningún retazo con ese ID.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
