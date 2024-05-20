import { RootState } from 'types';

export const authSelector = (state: RootState) => state.auth;

export const stopSelector = (state: RootState) => state.stop;
