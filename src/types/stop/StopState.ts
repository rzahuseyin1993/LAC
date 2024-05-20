import { ApiState } from 'types/ApiState';
import { Error } from 'types/Error';
import { Stop } from './Stop';

export type StopState = {
  stops: Stop[];
  service: string | undefined;
  status: ApiState;
  error?: Error;
};
