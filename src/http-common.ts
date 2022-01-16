import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://www.balldontlie.io/",
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;