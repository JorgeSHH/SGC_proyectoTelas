import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TasksPage } from "./pages/TasksPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import { Navigation } from "./components/Navigation";
import { Toaster } from "react-hot-toast";
import { AdmMenu } from "./pages/AdmMenu";
import { VenMenu } from "./pages/VenMenu";
import { Footer } from "./components/footer";
import { RegistroRetazos } from "./pages/RegistroRetazos";
import { ConsultaVen } from "./pages/ConsultaVen";
import { Login } from "./pages/Login";
import { GestionVen } from "./pages/GestionVen";
import { RegistroTiposTela } from "./pages/RegistroTiposTela";
import { GestionRetazo } from "./pages/GestionRetazo";
import { Dashboard } from "./pages/Dashboard";

// --- RUTA PROTEGIDAs ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin" || user.role === "administrator") {
      return <Navigate to="/adm-menu" replace />;
    } else {
      return <Navigate to="/ven-menu" replace />;
    }
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Si hay usuario logueado, redirigir según rol
  if (user) {
    if (user.role === "admin" || user.role === "administrator") {
      return <Navigate to="/adm-menu" replace />;
    } else {
      return <Navigate to="/ven-menu" replace />;
    }
  }

  // Si no hay usuario, muestra el login
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* --- RUTAS DE ADMINISTRADOR --- */}
        <Route
          path="/adm-menu"
          element={
            <ProtectedRoute allowedRoles={["admin", "administrator"]}>
              <AdmMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "administrator"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion-ven"
          element={
            <ProtectedRoute allowedRoles={["admin", "administrator"]}>
              <GestionVen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion-retazos"
          element={
            <ProtectedRoute allowedRoles={["admin", "administrator"]}>
              <GestionRetazo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registro-tipos-tela"
          element={
            <ProtectedRoute allowedRoles={["admin", "administrator"]}>
              <RegistroTiposTela />
            </ProtectedRoute>
          }
        />

        {/* --- RUTAS DE VENDEDORES--- */}
        <Route
          path="/ven-menu"
          element={
            <ProtectedRoute allowedRoles={["saleswoman"]}>
              <VenMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consulta-ven"
          element={
            <ProtectedRoute allowedRoles={["saleswoman"]}>
              <ConsultaVen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registro-retazos"
          element={
            <ProtectedRoute allowedRoles={["saleswoman"]}>
              <RegistroRetazos />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
