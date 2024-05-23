import { appAxios } from 'utils/api';

export const fetchAssetsApi = () => appAxios.get('/Assets/GetMapData');
