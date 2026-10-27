import axios from "axios"

let tokenProvider = null;

export const setTokenProvider = (provider) => {
  tokenProvider = provider;
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true
})

axiosInstance.interceptors.request.use(async (request) => {
  if (tokenProvider) {
    const token = await tokenProvider();
    if (token) request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});
