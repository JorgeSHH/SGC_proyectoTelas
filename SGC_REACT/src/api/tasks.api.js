import axios from "axios";

const tasksApi = axios.create({
  baseURL: "http://127.0.0.1:8000/tasks/api/v1/tasks/" // ← sin espacio
});

const fakerApi = axios.create({
  baseURL: "https://fakerapi.it/api/v2/persons?_quantity=10&_gender=female&_birthday_start=2005-01-01" // ← sin espacio
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
  baseURL: "http://127.0.0.1:8000/api/users/administrators/" // ← sin espacio
});

AdminApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("access");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const updateAdminApi = async (id, payload) => {
  const { data } = await AdminApi.patch(`${id}/`, payload);
  return data;
};

salesWomanApi.interceptors.request.use(
  (config) => {
    // 1. Leemos el token del localStorage
    const token = localStorage.getItem("access");

    // 2. Si el token existe, lo inyectamos en los headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 3. IMPORTANTE: Devolvemos la configuración modificada
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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



export const getFakerApi = () => fakerApi.get("/");
export const getAllTasks = () => tasksApi.get("/");
export const getTask = (id) => tasksApi.get(`/${id}/`);
export const createTask = (task) => tasksApi.post("/", task);
export const deleteTask = (id) => tasksApi.delete(`/${id}/`);
export const updateTask = (id, task) => tasksApi.put(`/${id}/`, task);