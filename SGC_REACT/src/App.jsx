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

function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/adm-menu" element={<AdmMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consulta-ven" element={<ConsultaVen />} />
        <Route path="/ven-menu" element={<VenMenu />} />
        <Route path="/registro-retazos" element={<RegistroRetazos />} />
        <Route path="/gestion-retazos" element={<GestionRetazo />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks-create" element={<TaskFormPage />} />
        <Route path="/tasks/:id" element={<TaskFormPage />} />
        <Route path="/gestion-ven" element={<GestionVen />} />
        <Route path="/registro-tipos-tela" element={<RegistroTiposTela />} />
      </Routes>
      <Toaster />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
