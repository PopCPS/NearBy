import axios from "axios"

export const api = axios.create({
  baseURL: "https://12dd-177-69-95-13.ngrok-free.app",
  timeout: 700,
})  