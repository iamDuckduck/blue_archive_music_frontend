import axios from "axios";

// TODO use env variable to config baseURL bewteen dev and production
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
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
