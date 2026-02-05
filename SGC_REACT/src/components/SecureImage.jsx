import React, { useState, useEffect } from "react";

// Componente reutilizable para cargar imágenes privadas
export const SecureImage = ({ id, className, tipo = "retazo" }) => {
  const [qrData, setQrData] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const fetchQR = async () => {
      // Validamos que existan ID y Token
      if (!id || !token) return;
      
      try {
        // Hacemos la petición con el Header Authorization
        // Usamos la variable 'tipo' para cambiar la URL dinámicamente
        const response = await fetch(
          `http://127.0.0.1:8000/api/inventory/qrs/${tipo}/${id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Enviamos el token
            },
          }
        );

        if (response.ok && isMounted) {
          const blob = await response.blob();
          // Creamos una URL temporal en memoria
          objectUrl = URL.createObjectURL(blob);
          setQrData(objectUrl);
        } else {
          console.warn("No se pudo cargar el QR para:", tipo, id);
        }
      } catch (error) {
        console.error("Error fetch QR:", error);
      }
    };

    fetchQR();

    // Limpieza de memoria al desmontar
    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, token, tipo]); // Se vuelve a ejecutar si cambia el ID, token o TIPO

  // Placeholder mientras carga
  if (!qrData) {
    return <div className="bg-gray-700 animate-pulse rounded-lg w-20 h-20 mx-auto"></div>;
  }

  // Retornamos la imagen normal usando la URL de memoria
  return <img src={qrData} alt={`QR ${id}`} className={className} />;
};