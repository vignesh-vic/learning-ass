import { BASE_URL } from "./apiPath"
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000, 
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if(error.response) {

            if (error.response.status === 500) {
               console.error("Internal Server Error:", error.response.data.message);
            }
        }else if (error.code === 'ECONNABORTED') {
            console.error("Request timed out. Please try again later.");
        }
        return Promise.reject(error)
    })


export default axiosInstance