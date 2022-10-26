import axios from 'axios';
const BASE_API_URL = "https://hcmus-kahoot-be.herokuapp.com/"
const axiosConfig = axios.create({
  baseURL: BASE_API_URL,
});

axiosConfig.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosConfig.interceptors.response.use(
  (response) => {
    // response.headers['Access-Control-Allow-Origin'] = '*';
    // response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    return response.data;
  },
  (error) => {
    return error.response.data;
  }
);

export default axiosConfig;
