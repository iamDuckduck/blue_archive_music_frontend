import axios from "axios";
import { API_BASE_URL } from "../constants/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getRandomSongList = () => {
    return axiosInstance.get<T>(this.endpoint).then((res) => res.data);
  };
}

export default APIClient;
