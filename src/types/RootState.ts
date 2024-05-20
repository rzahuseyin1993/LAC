import { AuthState } from './auth/AuthState';
import { StopState } from './stop/StopState';

export type RootState = {
  auth: AuthState;
  stop: StopState;
};
