import  axios  from "axios";

const customAxios = axios.create({
  baseURL: "https://backend.lingostep.uz/api",
  timeout: 10000,
  withCredentials: true,
});

customAxios.interceptors.response.use(
  response => response,
  error => {
    console.error("Axios error: ", error.message);
    return Promise.reject(error);
  }
);

export default customAxios;