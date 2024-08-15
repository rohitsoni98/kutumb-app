import axios from "axios";
import { SERVICES } from "./constant";
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_MESSAGE } from "../constant/utils";
import toast from "react-toast";

const API_SERVICE = {};
SERVICES?.forEach((service) => {
  const { service_name, baseURL = "" } = service;
  API_SERVICE[service_name] = axios.create({
    baseURL: `${baseURL}`,
    headers: { "Content-Type": "application/json" },
  });

  API_SERVICE[service_name]?.interceptors?.request?.use(
    (config) => {
      config.headers.Authorization = localStorage.getItem("auth_token");
      return config;
    },
    (error) =>
      Promise.resolve({
        success: false,
        ...(error?.response?.data ?? { message: DEFAULT_ERROR_MESSAGE }),
      })
  );

  API_SERVICE[service_name].interceptors.response.use(
    (response) => response,
    (error) => {
      const { response: { status } = {} } = error;
      if (status === 401) {
        toast.dismiss();
        toast.error(UNAUTHORIZED_MESSAGE);
        localStorage.clear();
        setTimeout(() => (window.location = "/"), 1000);
      }

      return Promise.reject({
        success: false,
        ...(typeof error?.response?.data === "object"
          ? error?.response?.data
          : { message: DEFAULT_ERROR_MESSAGE }),
      });
    }
  );
});
export default API_SERVICE;
