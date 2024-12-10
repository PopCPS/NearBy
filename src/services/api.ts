import axios from "axios"

export const api = axios.create({
  baseURL: "http://cduiwwa-anonymous-8081.exp.direct",
  timeout: 7000,
})