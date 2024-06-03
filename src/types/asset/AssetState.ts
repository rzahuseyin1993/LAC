import { ApiState } from 'types/ApiState';
import { Error } from 'types/Error';
import { Asset } from './Asset';

export type AssetState = {
  assets: Asset[];
  assetTypes: { id: string; name: string }[];
  conditions: { id: string; name: string }[];
  newLocation: { longitude: number; latitude: number } | undefined;
  service: string | undefined;
  status: ApiState;
  error?: Error;
};
