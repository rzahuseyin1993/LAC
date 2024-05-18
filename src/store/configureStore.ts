/**
 * Create the store with dynamic reducers
 */

import { configureStore, StoreEnhancer, Tuple } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';

import { createReducer } from './reducers';

const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
const { run: runSaga } = sagaMiddleware;

// Create the store with saga middleware
const middlewares = [sagaMiddleware];

const enhancers = [
  createInjectorsEnhancer({
    createReducer,
    runSaga,
  }),
] as StoreEnhancer[];

export const store = configureStore({
  reducer: createReducer(),
  middleware: getDefaultMiddleware =>
    new Tuple(...getDefaultMiddleware(), ...middlewares),
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(enhancers),
});
