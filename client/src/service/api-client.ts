import axios, { type AxiosRequestConfig } from "axios";

export interface FetchPageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
}
// TODO use env variable to config baseURL bewteen dev and production
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // use arrow function so no reference problem from this.endpoint
  getPageOST = (config: AxiosRequestConfig) => {
    return axiosInstance
      .get<FetchPageResponse<T>>(this.endpoint, config)
      .then((res) => res.data);
  };

  getAudioOst = (id: string | number) => {
    return axiosInstance
      .get<string>(`${this.endpoint}/${id}`)
      .then((res) => res.data);
  };

  getImageOst = (id: string | number) => {
    return axiosInstance
      .get<string>(`${this.endpoint}/${id}`)
      .then((res) => res.data);
  };
}

export default APIClient;
