import axios from "axios";

const api = axios.create({ baseURL: "https://api-repeat-words.vercel.app/api/words/" });
export { api };