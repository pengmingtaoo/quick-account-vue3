import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

type JSONValue = string | number | null | boolean | JSONValue[] | { [key: string]: JSONValue };

export class Http {
  instance: AxiosInstance //实例
  constructor(baseURL: string) {//构造
    this.instance = axios.create({ //初始化
      baseURL
    })
  }
  get<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params'|'url'|'data'|'method'>) {
    this.instance.request<R>({
      ...config,
      url: url,
      params: query,
      method:'get'
    })
  }
  // create
  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>) {
    return this.instance.request<R>({ ...config, url, data, method: 'post' })
  }
  // update
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data'>) {
    return this.instance.request<R>({ ...config, url, data, method: 'patch' })
  }
  // destroy
  delete<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params'>) {
    return this.instance.request<R>({ ...config, url: url, params: query, method: 'delete' })
  }
}

export const http = new Http('/api/v1')

http.instance.interceptors.response.use(response=>{
  console.log('response')
  return response
}, (error) => {
  if(error.response){
    const axiosError = error as AxiosError
    if(axiosError.response?.status === 429){
      alert('你太频繁了')
    }
  }
  throw error
})