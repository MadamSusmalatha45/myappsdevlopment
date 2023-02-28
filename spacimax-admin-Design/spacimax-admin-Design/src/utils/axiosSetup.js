import axios from "axios";
import {BASE_URL} from "../constant";

// export const BASE_URL = "http://50.17.107.208:3004/v1";
const token = localStorage.getItem('token')

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: !!token ? { Authorization: `Bearer ${token}` } : null,
});

