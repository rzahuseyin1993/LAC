import { appAxios } from 'utils/api';

export const fetchProfileApi = (email: string) =>
  appAxios.post(`/autherntication/profile`, { email: email });
