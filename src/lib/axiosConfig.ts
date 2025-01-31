import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_HTTP_BASE_URL,
    withCredentials: true,
})  