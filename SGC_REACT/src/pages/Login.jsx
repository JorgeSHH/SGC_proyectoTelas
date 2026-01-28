import { useState } from 'react';
import axios from 'axios';
import Logo from "../assets/castillo logo.jpg";
import { useNavigate } from 'react-router-dom';
import { Footer } from "../components/footer";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        email: formData.correo,
        password: formData.contrasena
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`¡Login exitoso! Hola ${user.username}`);

      if (user.role === 'admin') {
        navigate('/adm-menu'); // Es mejor usar rutas relativas
      } else {
        navigate('/ven-menu');
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    // 1. Contenedor principal: Flex columna, altura mínima de pantalla
    <div className="flex flex-col min-h-screen w-full">
      
      {/* 2. Área del Login: Ocupa el espacio disponible (flex-grow) y centra el contenido */}
      <div
        className="flex-grow flex items-center justify-center p-4 w-full relative z-0 bg-gray-50"
        style={{
          backgroundImage: `linear-gradient(rgba(216, 68, 68, 0.6), rgba(30, 30, 42, 0.95)), url('/src/assets/wallpaper.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-[400px] p-5 z-10">
          <div className="bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] px-10 py-5 text-center">
            <div className="logo flex justify-center items-center">
              <img
                src={Logo}
                alt="logo"
                className="h-36 w-36 object-cover mb-0 rounded-full"
              />
            </div>

            <form className="formulario mt-2" onSubmit={handleSubmit}>
              <h2 className="text-[28px] text-gray-800 mb-6">Iniciar Sesión</h2>

              <div className="input-group mb-5 text-left">
                <label htmlFor="correo" className="block mb-0 text-gray-600 font-bold">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tu@email.com"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_5px_rgba(102,126,234,0.5)]"
                />
              </div>

              <div className="input-group mb-5 text-left">
                <label htmlFor="contrasena" className="block mb-0 text-gray-600 font-bold">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  placeholder="Contraseña"
                  value={formData.contrasena}
                  onChange={handleChange}
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

              <a href="#" className="block mt-5 text-indigo-500 text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Footer: Se coloca al final natural gracias al flex-col del padre */}
      <Footer />
      
    </div>
  );
};