import {
  createAsyncThunk,
  createSlice /*PayloadAction*/,
} from '@reduxjs/toolkit';

import { ApiState } from 'types/ApiState';
import { AuthState } from 'types/auth/AuthState';
import { fetchProfileApi } from 'services/auth';

export const initialState: AuthState = {
  service: undefined,
  status: ApiState.idle,
  error: undefined,
};

export const fetchProfile = createAsyncThunk(
  'Auth/fetchProfile',
  async (email: string) => {
    const response = await fetchProfileApi(email);
    return response.data;
  },
);

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    // setProfile: (state, action: PayloadAction<Profile | undefined>) => {
    //   state.profile = action.payload;
    // },
  },
  extraReducers: builder => {
    // fetch profile
    builder.addCase(fetchProfile.pending, state => {
      state.service = 'fetchProfile';
      state.status = ApiState.pending;
      state.error = undefined;
    });
    builder.addCase(
      fetchProfile.fulfilled,
      (state /*action: PayloadAction<Profile>*/) => {
        //state.profile = action.payload;
        state.status = ApiState.fulfilled;
        state.error = undefined;
      },
    );
    builder.addCase(fetchProfile.rejected, (state, { error }) => {
      state.error = error;
      state.status = ApiState.rejected;
    });
  },
});

// export const {} = authSlice.actions;
