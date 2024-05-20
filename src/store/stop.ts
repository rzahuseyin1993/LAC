import {
  //   createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { ApiState } from 'types/ApiState';
import { Stop } from 'types/stop/Stop';
import { StopState } from 'types/stop/StopState';

const initialStops = [
  {
    Id: 10,
    AssetId: 12345,
    Description: 'Stop Sign',
    Value: 230,
    MaintenanceCost: 0,
    Intersection: 'Main Street and Elm Avenue',
    Latitude: 37.42193453,
    Longitude: -122.08423434,
  },
  {
    Id: 11,
    AssetId: 12347,
    Description: 'Traffic Light',
    Value: 839,
    MaintenanceCost: 0,
    Intersection: 'Broadway and 5th Avenue',
    Latitude: 37.4654353,
    Longitude: -122.0876845,
  },
  {
    Id: 12,
    AssetId: 12346,
    Description: 'Road Sign - Speed Limit',
    Value: 238,
    MaintenanceCost: 0,
    Intersection: 'Main Street and Maple Drive',
    Latitude: 37.234347,
    Longitude: -122.0843453,
  },
  {
    Id: 13,
    AssetId: 73894,
    Description: 'Crosswalk',
    Value: 6377,
    MaintenanceCost: 0,
    Intersection: 'Oak Street and Pine Avenue',
    Latitude: 37.4219617,
    Longitude: -122.0842344,
  },
  {
    Id: 14,
    AssetId: 78935,
    Description: 'Road Sign - Yield',
    Value: 7383,
    MaintenanceCost: 0,
    Intersection: '1st Avenue and Main Street',
    Latitude: 37.345435,
    Longitude: -122.0846345,
  },
];

export const initialState: StopState = {
  stops: initialStops,
  service: undefined,
  status: ApiState.idle,
  error: undefined,
};

export const stopSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setStops: (state, action: PayloadAction<Stop[]>) => {
      state.stops = action.payload;
    },
  },
});

export const { setStops } = stopSlice.actions;
