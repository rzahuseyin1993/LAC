/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';

import { InjectedReducersType } from 'types/injectors';

import { authSlice } from './auth';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0) {
    // @ts-ignore
    //return state => state;
    // return combineReducers({
    //   ...injectedReducers,
    //   projects: projectSlice.reducer,
    // });
  }

  return combineReducers({
    ...injectedReducers,
    auth: authSlice.reducer,
  });
}
