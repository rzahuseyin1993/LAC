import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createAssetApi,
  fetchAssetsApi,
  fetchAssetTypesApi,
  fetchConditionsApi,
} from 'services/asset';

import { ApiState } from 'types/ApiState';
import { Asset } from 'types/asset/Asset';
import { AssetState } from 'types/asset/AssetState';
// import { validateLngLat } from 'utils/validate';

export const initialState: AssetState = {
  assets: [],
  assetTypes: [],
  conditions: [],
  newLocation: undefined,
  service: undefined,
  status: ApiState.idle,
  error: undefined,
};

export const fetchAssets = createAsyncThunk('Asset/fetchAssets', async () => {
  const response: any = await fetchAssetsApi();
  // const originAssets: Asset[] = response;
  // const newAssets = originAssets.filter(assetItem =>
  //   validateLngLat(assetItem.longitude, assetItem.latitude),
  // );
  return response;
});

export const fetchConditions = createAsyncThunk(
  'Asset/fetchConditions',
  async () => {
    const response: any = await fetchConditionsApi();
    return response;
  },
);

export const fetchAssetTypes = createAsyncThunk(
  'Asset/fetchAssetTypes',
  async () => {
    const response: any = await fetchAssetTypesApi();
    return response;
  },
);

export const createAsset = createAsyncThunk(
  'Asset/createAsset',
  async (
    payload: {
      AssetId: string;
      Description: string;
      Longitude: number;
      Latitude: number;
      AssetTypeId: number;
      ConditionId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response: any = await createAssetApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const assetSlice = createSlice({
  name: 'Asset',
  initialState,
  reducers: {
    setAssets: (state, action: PayloadAction<Asset[]>) => {
      state.assets = action.payload;
    },
    setNewLoaction: (
      state,
      action: PayloadAction<
        { longitude: number; latitude: number } | undefined
      >,
    ) => {
      state.newLocation = action.payload;
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

    // fetch asset types
    builder.addCase(fetchAssetTypes.pending, state => {
      state.service = 'fetchAssetTypes';
      state.status = ApiState.pending;
      state.error = undefined;
    });
    builder.addCase(
      fetchAssetTypes.fulfilled,
      (state, action: PayloadAction<{ id: string; name: string }[]>) => {
        state.assetTypes = action.payload;
        state.status = ApiState.fulfilled;
        state.error = undefined;
      },
    );
    builder.addCase(fetchAssetTypes.rejected, (state, { error }) => {
      state.error = error;
      state.status = ApiState.rejected;
    });

    // fetch conditions
    builder.addCase(fetchConditions.pending, state => {
      state.service = 'fetchConditions';
      state.status = ApiState.pending;
      state.error = undefined;
    });
    builder.addCase(
      fetchConditions.fulfilled,
      (state, action: PayloadAction<{ id: string; name: string }[]>) => {
        state.conditions = action.payload;
        state.status = ApiState.fulfilled;
        state.error = undefined;
      },
    );
    builder.addCase(fetchConditions.rejected, (state, { error }) => {
      state.error = error;
      state.status = ApiState.rejected;
    });

    // create asset
    builder.addCase(createAsset.pending, state => {
      state.service = 'createAsset';
      state.status = ApiState.pending;
      state.error = undefined;
    });
    builder.addCase(createAsset.fulfilled, state => {
      // state.assets = action.payload;
      state.status = ApiState.fulfilled;
      state.error = undefined;
    });
    builder.addCase(createAsset.rejected, (state, action: any) => {
      const errorData = action.payload?.response?.data;
      if (errorData?.errors) {
        state.error = {
          message:
            errorData?.title +
            '\n' +
            Object.keys(errorData?.errors)
              .map(key => {
                return errorData?.errors[key].join('');
              })
              .join('\n'),
          statusCode: errorData?.status,
        };
      } else if (action.payload) {
        state.error = action.payload.message;
      } else {
        state.error = action.error;
      }
      state.status = ApiState.rejected;
    });
  },
});

export const { setAssets, setNewLoaction } = assetSlice.actions;
