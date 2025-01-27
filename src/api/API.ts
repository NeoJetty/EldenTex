import axios from "axios";

const DEBUG_LEVEL = 1;

const axiosApi = axios.create({
  baseURL: "/api",
  withCredentials: true, // Include cookies
});

// Add request interceptor
axiosApi.interceptors.request.use((config) => {
  if (DEBUG_LEVEL > 0) {
    console.log(
      "%cReq:",
      "color: yellow",
      config.url,
      config.data == undefined ? "" : config.data
    );
  }
  return config;
});

// Add response interceptor
axiosApi.interceptors.response.use(
  (response) => {
    if (DEBUG_LEVEL > 0) {
      console.log("%cRes:", "color: green", response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      handleLogoutClientSide();
    }
    return Promise.reject(error);
  }
);

const handleLogoutClientSide = () => {
  // Handle logout logic here
  console.log("Logged out...");
  localStorage.removeItem("isLoggedInUser");
};

export default axiosApi;
