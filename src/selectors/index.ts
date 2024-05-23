import { RootState } from 'types';

export const authSelector = (state: RootState) => state.auth;

export const assetSelector = (state: RootState) => state.asset;
