import React, { useState, useEffect } from "react";


export const SecureImage = ({ id, className, tipo = "retazo" }) => {
  const [qrData, setQrData] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const fetchQR = async () => {

      if (!id || !token) return;
      
      try {

        const response = await fetch(
          `http://127.0.0.1:8000/api/inventory/qrs/${tipo}/${id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok && isMounted) {
          const blob = await response.blob();

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


    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, token, tipo]); 

  if (!qrData) {
    return <div className="bg-gray-700 animate-pulse rounded-lg w-20 h-20 mx-auto"></div>;
  }


  return <img src={qrData} alt={`QR ${id}`} className={className} />;
};