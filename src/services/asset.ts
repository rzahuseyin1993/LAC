import { appAxios } from 'utils/api';

export const fetchAssetsApi = () => appAxios.get('/Assets/GetMapData');

export const fetchAssetTypesApi = () => appAxios.get('/AssetType/Get');

export const fetchConditionsApi = () => appAxios.get('/Condition/Get');

export const createAssetApi = (payload: {
  AssetId: string;
  Description: string;
  Longitude: number;
  Latitude: number;
  AssetTypeId: number;
  ConditionId: number;
}) => appAxios.post('/Assets/Post', payload);
