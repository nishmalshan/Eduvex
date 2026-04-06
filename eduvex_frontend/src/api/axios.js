import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true, // needed later for cookies
});

export default API_URL;