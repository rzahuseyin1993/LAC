import { AuthState } from './auth/AuthState';
import { AssetState } from './asset/AssetState';

export type RootState = {
  auth: AuthState;
  asset: AssetState;
};
