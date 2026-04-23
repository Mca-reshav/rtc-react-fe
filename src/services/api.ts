import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
interface ICreate {
    user: { name: string }
}
interface IJoin extends ICreate {
    sessionId: string,
}
export const createSession = (data: ICreate) => api.post("/create", data);
export const joinSession = (data: IJoin) => api.post("/join", data);
export const getSession = (id: string) => api.get(`/${id}`);