import { appAxios } from 'utils/api';

export const fetchStopsApi = () => appAxios.get('/map.json');
