import axios from "axios"

export const api = axios.create({
  baseURL: "https://a652-186-215-200-82.ngrok-free.app",
  timeout: 700,
})  