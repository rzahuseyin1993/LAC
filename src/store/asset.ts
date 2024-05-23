import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAssetsApi } from 'services/asset';

import { ApiState } from 'types/ApiState';
import { Asset } from 'types/asset/Asset';
import { AssetState } from 'types/asset/AssetState';
import { validateLngLat } from 'utils/validate';

export const initialState: AssetState = {
  assets: [],
  service: undefined,
  status: ApiState.idle,
  error: undefined,
};

export const fetchAssets = createAsyncThunk('Asset/fetchAssets', async () => {
  const response: any = await fetchAssetsApi();
  const originAssets: Asset[] = response;
  const newAssets = originAssets.filter(assetItem =>
    validateLngLat(assetItem.longitude, assetItem.latitude),
  );
  return newAssets;
});

export const assetSlice = createSlice({
  name: 'Asset',
  initialState,
  reducers: {
    setAssets: (state, action: PayloadAction<Asset[]>) => {
      state.assets = action.payload;
    },
  },
  extraReducers: builder => {
    // fetch assets
    builder.addCase(fetchAssets.pending, state => {
      state.service = 'fetchAssets';
      state.status = ApiState.pending;
      state.error = undefined;
    });
    builder.addCase(
      fetchAssets.fulfilled,
      (state, action: PayloadAction<Asset[]>) => {
        state.assets = action.payload;
        state.status = ApiState.fulfilled;
        state.error = undefined;
      },
    );
    builder.addCase(fetchAssets.rejected, (state, { error }) => {
      state.error = error;
      state.status = ApiState.rejected;
    });
  },
});

export const { setAssets } = assetSlice.actions;
