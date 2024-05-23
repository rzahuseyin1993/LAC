import { ApiState } from 'types/ApiState';
import { Error } from 'types/Error';
import { Asset } from './Asset';

export type AssetState = {
  assets: Asset[];
  service: string | undefined;
  status: ApiState;
  error?: Error;
};
