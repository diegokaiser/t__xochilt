import axios from "axios";

const instance = axios.create({
  timeout: 25000,
  baseURL: process.env.NEXT_PUBLIC__FIREBASE_quetzal,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
