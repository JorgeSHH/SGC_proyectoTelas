import { useState } from 'react'; // ❌ ESTO ES LO IMPORTANTE: useState es de React, no de axios
import axios from 'axios';
import Logo from "../assets/castillo logo.jpg";
import { useNavigate } from 'react-router-dom';
// Asegúrate de importar tu Logo aquí
// import Logo from './path/to/logo.png';

export const Login = () => {
  const navigate = useNavigate();// 1. Guardamos lo que el usuario escribe en el estado
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });

  // 2. Función para actualizar el estado cuando escribes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Función para enviar el formulario (sin recargar página)
  const handleSubmit = async (e) => {
    e.preventDefault(); // ⛔ DETIENE la recarga de la página

    try {
      // Hacemos el POST a tu endpoint de Django
      // Mapeamos los nombres de tus inputs (correo, contrasena) a lo que espera la API (email, password)
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        email: formData.correo,    // 'correo' de tu input -> 'email' para la API
        password: formData.contrasena // 'contrasena' de tu input -> 'password' para la API
      });

      // Aquí recibes tu JSON: { refresh, access, user }
      const { access, refresh, user } = response.data;

      // 💾 GUARDAR TOKENES (opcional pero necesario para loguearse)
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`¡Login exitoso! Hola ${user.username}`);

       // 2. REDIRECCIÓN SEGÚN EL ROL
      // Usamos .toLowerCase() para evitar problemas si el backend devuelve 'Admin' o 'admin'
      if (user.role === 'admin') {
        navigate('http://localhost:5173/adm-menu'); // Va al menú de admin
      } else {
        navigate('http://localhost:5173/ven-menu'); // Va al menú de vendedoras
      }
      
      // Aquí podrías redirigir al usuario: window.location.href = '/dashboard';

    } catch (error) {
      console.error("Error:", error);
      // Si el backend responde con error 400 o 401
      alert("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-gray-50 p-4 absolute inset-0 z-0"
      style={{
        backgroundImage: `linear-gradient(rgba(216, 68, 68, 0.6), rgba(30, 30, 42, 0.95)), url('/src/assets/wallpaper.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-[400px] p-5 ">
        <div className="bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] px-10 py-5 text-center">
          <div className="logo flex justify-center items-center">
            <img
              src={Logo} // Asegúrate de que Logo esté importado arriba
              alt="logo"
              className="h-36 w-36 object-cover mb-0 rounded-full"
            />
          </div>

          {/* Quitamos el action="" y ponemos onSubmit={handleSubmit} */}
          <form className="formulario mt-2" onSubmit={handleSubmit}>
            <h2 className="text-[28px] text-gray-800 mb-6">Iniciar Sesión</h2>

            <div className="input-group mb-5 text-left">
              <label
                htmlFor="correo"
                className="block mb-0 text-gray-600 font-bold"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="tu@email.com"
                value={formData.correo} // <--- Controlado por el estado
                onChange={handleChange} // <--- Escucha cambios
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_5px_rgba(102,126,234,0.5)]"
              />
            </div>

            <div className="input-group mb-5 text-left">
              <label
                htmlFor="contrasena"
                className="block mb-0 text-gray-600 font-bold"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena} // <--- Controlado por el estado
                onChange={handleChange} // <--- Escucha cambios
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_5px_rgba(102,126,234,0.5)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#e30713] text-white rounded-md text-base mt-2 hover:bg-black transition-colors"
            >
              Ingresar
            </button>

            <a
              href="#"
              className="block mt-5 text-indigo-500 text-sm hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};