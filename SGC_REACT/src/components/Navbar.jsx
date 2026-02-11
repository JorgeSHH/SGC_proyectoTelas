import React, { useState, useEffect } from "react";
import "../index.css";
import miLogo from "../assets/castillo logo.jpg";
import { getAllAdmin } from "../api/tasks.api";
import { Link } from "react-router-dom"; 

export function Navbar() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh");
    const accessToken = localStorage.getItem("access");

    try {
        await fetch('http://127.0.0.1:8000/api/users/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refresh: refreshToken })
        });
    } catch (error) {
        console.error("El servidor no pudo invalidar el token, pero limpiaremos el front igual:", error);
    }

    localStorage.clear(); 
    window.location.href = '/login'; 
  };

  useEffect(() => {
    async function loadUserData() {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
            console.error("No hay token");
            setLoading(false);
            return;
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedToken = JSON.parse(jsonPayload);
        
        const userEmail = decodedToken.user_email;
        const response = await getAllAdmin();
        let adminsList = [];
        if (Array.isArray(response)) {
            adminsList = response;
        } else if (response && Array.isArray(response.results)) {
            adminsList = response.results;
        }

        const myProfile = adminsList.find(admin => admin.email === userEmail);

        if (myProfile) {
            setAdminData(myProfile);
        } else {
            console.warn("No se encontró perfil con el email:", userEmail);
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  return (
    <>
      {/* --- PRIMERA NAVBAR --- */}
      <nav
        id="nav-bar"
        className="bg-[#3b3c3e] shadow-sm border-b-4 border-[#ec4444]"
      >
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo - CAMBIO A LINK */}
            <div className="flex items-center space-x-4 hover:cursor-pointer">
              <Link to="/adm-menu">   
                <img
                  src={miLogo}
                  className="h-10 w-10 rounded-full object-cover border border-gray-300"
                  alt="Logo"
                />
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-xl text-[#ec4444] font-bold uppercase">
                  Administrador
                </h1>
                <p className="text-sm text-gray-300 font-bold uppercase">
                  Sistema Administrativo
                </p>
              </div>
            </div>

            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-bold uppercase">
                  {loading 
                    ? "Cargando..." 
                    : adminData 
                    ? `${adminData.first_name} ${adminData.last_name}` 
                    : "No identificado"}
                </p>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  CODIGO: {loading ? "..." : (adminData ? adminData.username : "??")}
                </p>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-6 rounded-full hover:opacity-80 transition-opacity"
                title="Cerrar Sesión"
              >
                <div className="h-10 w-10 rounded-full bg-[#ec4444] flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <nav
        id="nav-bar2"
        className="bg-white/10 backdrop-blur-md shadow-sm border-b border-gray-300 sticky"
      >
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="hidden md:flex items-center h-12 space-x-8">
            <Link to='/gestion-ven' className="text-gray-900 hover:text-[#ec4444] px-3 py-2 rounded-md text-sm font-bold transition">
              Gestión de Vendedoras
            </Link>
            <Link to="/registro-tipos-tela" className="text-gray-600 hover:text-[#ec4444] px-3 py-2 rounded-md text-sm font-bold transition">
              Gestión de Telas
            </Link>
            <Link to="/gestion-retazos" className="text-gray-600 hover:text-[#ec4444] px-3 py-2 rounded-md text-sm font-bold transition">
              Gestión de Retazos
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-[#ec4444] px-3 py-2 rounded-md text-sm font-bold transition">
              Dashboard Estadístico
            </Link>
          </div>


          <div className="flex md:hidden items-center justify-around h-14 w-full bg-white/80 backdrop-blur-sm -mx-4 px-4 border-t border-gray-200">
            
            <Link to="/gestion-ven" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#ec4444]">
              <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" fill="black" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
            </Link>

            <Link to="/registro-tipos-tela" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#ec4444]">
              <svg fill="#000000" height="40px" width="40px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M391.533-1c-53.447,0-97.665,41.5-102.039,93.867H16.067V511h375.467c56.32,0,102.4-46.08,102.4-102.4V101.4 C493.933,45.08,447.853-1,391.533-1z M33.133,174.424l104.821-64.49h59.894L33.133,206.02V174.424z M289.133,278.194 l-31.129-7.781l31.129-17.787V278.194z M289.133,232.97l-55.058,31.461l-44.863-11.215l99.922-59.972V232.97z M289.133,173.341 l-123.334,74.023l-44.986-11.245l168.32-102.498V173.341z M275.388,292.349l-49.633,29.499L33.133,265.667v-33.875 L275.388,292.349z M94.241,400.013l-61.108-22.915v-42.25l111.906,34.973L94.241,400.013z M33.133,316.967v-33.522 l172.557,50.329l-42.192,25.077l0.325-1.04L33.133,316.967z M33.133,395.325l42.305,15.864l-42.305,25.144V395.325z M33.133,456.185l256-152.153v39.999l-256,148.51V456.185z M289.133,363.762v39.906l-155.887,90.265H64.745L289.133,363.762z M289.133,113.639L97.549,230.303l-50.522-12.629L231.72,109.933h57.414V113.639z M105.385,109.933l-72.252,44.452v-44.452 H105.385z M167.305,493.933l122.827-71.121c4.156,29.594,21.081,55.232,44.984,71.121H167.305z M391.533,493.933 c-46.933,0-85.333-38.4-85.333-85.333s38.4-85.333,85.333-85.333s85.333,38.4,85.333,85.333S438.467,493.933,391.533,493.933z M391.533,306.2c-35.513,0-66.949,18.325-85.333,45.983V101.4c0-46.933,38.4-85.333,85.333-85.333s85.333,38.4,85.333,85.333 v250.783C458.482,324.525,427.046,306.2,391.533,306.2z"/>
                <path d="M391.533,348.867c-33.28,0-59.733,26.453-59.733,59.733s26.453,59.733,59.733,59.733s59.733-26.453,59.733-59.733 S424.813,348.867,391.533,348.867z M391.533,451.267c-23.893,0-42.667-18.773-42.667-42.667 c0-23.893,18.773-42.667,42.667-42.667S434.2,384.707,434.2,408.6C434.2,432.493,415.427,451.267,391.533,451.267z"/>
              </svg>
            </Link>

            <Link to="/gestion-retazos" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#ec4444]">
              <svg fill="#000000" height="40px" width="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297 297">
                <path d="m293.489,62.166c-3.314-2.909-8.151-3.28-11.872-0.914l-126.371,80.373 80.372-126.372c2.366-3.72 1.994-8.557-0.914-11.872-2.906-3.315-7.652-4.314-11.652-2.454-67.283,31.326-95.476,79.727-107.28,114.814-8.011,23.812-9.759,44.681-9.91,57.29l-11.01,7.002c-0.666-1.916-1.554-3.77-2.67-5.524l-3.837-6.031c-7.783-12.24-24.074-15.863-36.312-8.08l-39.707,25.253c-5.929,3.77-10.035,9.624-11.561,16.483-1.526,6.858-0.29,13.901 3.48,19.83l.001,.002 3.837,6.031c3.77,5.929 9.624,10.035 16.483,11.561 1.916,0.426 3.847,0.637 5.765,0.637 4.943,0 9.793-1.401 14.065-4.118l46.212-29.816-29.556,46.472c-7.784,12.238-4.16,28.528 8.079,36.312l6.032,3.837h0.001c4.272,2.718 9.122,4.119 14.066,4.119 1.917,0 3.848-0.21 5.763-0.637 6.859-1.526 12.712-5.631 16.484-11.561l25.252-39.706c7.784-12.238 4.161-28.528-8.079-36.313l-6.032-3.836c-1.861-1.184-3.831-2.117-5.87-2.795l7.09-11.148c12.608-0.149 33.466-1.893 57.29-9.907 35.087-11.804 83.488-39.997 114.814-107.281 1.861-3.997 0.862-8.744-2.453-11.651zm-158.623,59.088c11.511-33.648 32.411-61.304 62.325-82.575l-68.945,108.404c1.379-7.877 3.472-16.628 6.62-25.829zm-101.122,98.071c-1.454,0.926-3.181,1.228-4.864,0.854-1.682-0.374-3.118-1.381-4.043-2.837l-3.838-6.032c-0.924-1.454-1.227-3.18-0.853-4.862 0.374-1.682 1.381-3.118 2.835-4.043l39.706-25.253c3.003-1.911 6.998-1.021 8.908,1.982l3.837,6.031c0.925,1.455 1.227,3.183 0.853,4.864-0.374,1.683-1.381,3.118-2.835,4.044l-39.706,25.252zm86.235,15.118l-25.252,39.707c-0.926,1.454-2.361,2.461-4.043,2.835-1.683,0.374-3.409,0.07-4.864-0.854h0.001l-6.033-3.837c-3.002-1.91-3.891-5.905-1.981-8.908l25.252-39.707c0.926-1.454 2.361-2.461 4.043-2.835 1.686-0.371 3.411-0.07 4.864,0.855l6.033,3.836c3,1.91 3.889,5.905 1.98,8.908zm55.638-72.439c-9.202,3.148-17.953,5.241-25.83,6.62l108.404-68.946c-21.27,29.914-48.927,50.815-82.574,62.326z"/>
              </svg>
            </Link>

            <Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#ec4444]">
              <svg width="40px" height="40px" viewBox="0 0 1024 1024" fill="black" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M521.58 516.763v-472.816c250.725 22.642 450.175 222.092 472.817 472.817h-472.816zM918.229 593.091h-435.436c-21.963 0-39.769-17.805-39.769-39.769 0 0 0 0 0 0v-435.463c-222.914 20.121-397.682 207.273-397.682 435.436 0 241.605 195.898 437.452 437.451 437.451 228.163 0 415.339-174.715 435.436-397.657z" /></svg>
            </Link>
          </div>

        </div>
      </nav>
    </>
  );
}