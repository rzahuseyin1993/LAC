import { ApiState } from 'types/ApiState';
import { Error } from 'types/Error';

export type AuthState = {
  service: string | undefined;
  status: ApiState;
  error?: Error;
};
