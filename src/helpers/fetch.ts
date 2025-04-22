import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosRequestConfig} from 'axios';
import {BASE_URL} from '@env';
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface FetchOptions {
  method?: HttpMethod;
  inFormData?: boolean;
  isToken?: boolean;
  url?: string;
}

interface FetchResponse {
  data?: any;
  err?: string[];
  status: boolean;
}

const commonParams: Record<string, any> = {};

export default function Fetch(
  endPoint: string,
  params: Record<string, any> = {},
  option: FetchOptions = {},
): Promise<FetchResponse> {
  let baseURL = BASE_URL;

  const method: HttpMethod = option?.method ?? 'get';
  const inFormData = option?.inFormData ?? false;
  const isToken = option?.isToken ?? true;
  const url = option?.url;
  let parameters: any = {
    ...commonParams,
    ...params,
  };

  const FetchHeader = async (): Promise<AxiosRequestConfig> => {
    const token = isToken
      ? await AsyncStorage.getItem('userToken')
          .then(data => {
            // const parsed = data ? JSON.parse(data) : null;
            // return parsed?.access_token || '';
            return data || '';
          })
          .catch(err => {
            console.log('Error fetching token:', err);
            return '';
          })
      : '';

    const headers: Record<string, string> = {
      'Content-Type': inFormData ? 'multipart/form-data' : 'application/json',
      ...(token && {Authorization: `Bearer ${token}`}),
    };
    return {headers};
  };

  const convertToForm = () => {
    let formData = new FormData();
    for (let name in parameters) {
      if (Array.isArray(parameters[name])) {
        for (var i = 0; i < parameters[name].length; i++) {
          formData.append(`${name}`, parameters[name][i]);
        }
      } else {
        formData.append(name, parameters[name]);
      }
    }
    return formData;
  };

  const fetch = async (): Promise<FetchResponse> => {
    console.log("baseURL", baseURL + endPoint);
    
    try {
      const headers = await FetchHeader();
      return axios[method](
        url ? url : baseURL + endPoint,
        inFormData
          ? convertToForm()
          : Object.keys(parameters).length
          ? parameters
          : headers,
        headers,
      )
        .then((response: {data: any}) => {
          const dataParse = {data: response.data, status: true};
          return dataParse;
        })
        .catch((err: any) => {
          if (err?.response?.status === 500) {
            return {err: ['Something Went Wrong'], status: false};
          } else {
            return {...err?.response?.data, status: false};
          }
        });
    } catch (error) {
      return {err: ['Something Went Wrong'], status: false};
    }
  };

  if (isToken === false) {
    return fetch();
  }

  return fetch();
}
