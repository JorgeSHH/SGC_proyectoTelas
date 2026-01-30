import axios from "axios";

const tasksApi = axios.create({
  baseURL: "http://127.0.0.1:8000/tasks/api/v1/tasks/"
});

const fakerApi = axios.create({
  baseURL: "https://fakerapi.it/api/v2/persons?_quantity=10&_gender=female&_birthday_start=2005-01-01"
});

axios.defaults.withCredentials = true;

const scrapsApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/inventory/scraps/",
});

const typesApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/inventory/types/",
});

const salesWomanApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/users/saleswoman/",
});

const AdminApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/users/administrators/"
});

// ✅ NUEVA INSTANCIA PARA EL DASHBOARD
const dashboardApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/inventory/dashboard/"
});

// --- INTERCEPTORES (Tokens) ---

AdminApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("access");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

salesWomanApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ✅ INTERCEPTOR PARA EL DASHBOARD (Igual que los anteriores)
dashboardApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- EXPORTS EXISTENTES ---

export const updateAdminApi = async (id, payload) => {
  const { data } = await AdminApi.patch(`${id}/`, payload);
  return data;
};

export const getAllScraps = async () => {
  try {
    const varScrap = await scrapsApi.get("/");
    return varScrap.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTypes = async () => {
  try {
    const varTypes = await typesApi.get("/");
    return varTypes.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllSalesWoman = async () => {
  try {
    const varSalesWoman = await salesWomanApi.get("/");
    return varSalesWoman.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllAdmin = async () => {
  try {
    const { data } = await AdminApi.get("/");
    return data;
  } catch (error) {
    console.error(error);
  }
};

// ✅ NUEVA FUNCIÓN EXPORTADA
export const getDashboardMetrics = async () => {
  try {
    // Llamamos a 'metrics/' porque el baseURL ya incluye '.../dashboard/'
    const { data } = await dashboardApi.get("metrics/");
    return data;
  } catch (error) {
    console.error("Error al cargar métricas:", error);
    throw error;
  }
};

export const getFakerApi = () => fakerApi.get("/");
export const getAllTasks = () => tasksApi.get("/");
export const getTask = (id) => tasksApi.get(`/${id}/`);
export const createTask = (task) => tasksApi.post("/", task);
export const deleteTask = (id) => tasksApi.delete(`/${id}/`);
export const updateTask = (id, task) => tasksApi.put(`/${id}/`, task);