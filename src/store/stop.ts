import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchStopsApi } from 'services/stop';

import { ApiState } from 'types/ApiState';
import { Stop } from 'types/stop/Stop';
import { StopState } from 'types/stop/StopState';

export const initialState: StopState = {
  stops: [],
  service: undefined,
  status: ApiState.idle,
  error: undefined,
};

export const fetchStops = createAsyncThunk('Stop/fetchStops', async () => {
  const response: any = await fetchStopsApi();
  console.log(response);
  return response;
});

export const stopSlice = createSlice({
  name: 'Stop',
  initialState,
  reducers: {
    setStops: (state, action: PayloadAction<Stop[]>) => {
      state.stops = action.payload;
    },
  },
  extraReducers: builder => {
    // fetch stops
    builder.addCase(fetchStops.pending, state => {
      state.service = 'fetchStops';
      state.status = ApiState.pending;
      state.error = undefined;
    });
    builder.addCase(
      fetchStops.fulfilled,
      (state, action: PayloadAction<Stop[]>) => {
        state.stops = action.payload;
        state.status = ApiState.fulfilled;
        state.error = undefined;
      },
    );
    builder.addCase(fetchStops.rejected, (state, { error }) => {
      state.error = error;
      state.status = ApiState.rejected;
    });
  },
});

export const { setStops } = stopSlice.actions;
