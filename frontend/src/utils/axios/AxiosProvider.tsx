import { useEffect, useState } from "react";
import { useToast } from "../toast";
import { InternalAxiosRequestConfig } from "axios";
import axios from "./axios";
import authApi from "../auth/authApi";

export default function AxiosProvider({ children }: { children: React.ReactNode; }) {
  const toast = useToast();
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any) => { // eslint-disable-line
      const { message } = error?.response?.data || error;
      toast.open(message, "error", 10 * 1000);
      return Promise.reject(error);
    };

    const onRequest = (req: InternalAxiosRequestConfig) => {
      const user = authApi.getUser();

      if (user) {
        req.headers.user = user._id;
        req.headers.company = user.company._id;
        req.headers.Authorization = `Bearer ${user.token}`;
      }

      return req;
    };

    const reqInterceptor = axios.interceptors.request.use(onRequest, errorHandler);
    const resInterceptor = axios.interceptors.response.use(undefined, errorHandler);
    setShouldMount(true);

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [toast]);

  return <>{shouldMount ? children : null}</>;
}