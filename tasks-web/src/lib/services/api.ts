import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});


// TODO: Criar env