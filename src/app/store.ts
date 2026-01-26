import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from '../reducers/login/userSlice';
import { usersAPI } from '../reducers/users/usersAPI';
import { loginAPI } from '../reducers/login/loginAPI';
import { doctorsAPI } from '../reducers/doctors/doctorsAPI';
import { appointmentsAPI } from '../reducers/appointments/appointmentsAPI';
import { complaintsAPI } from '../reducers/complaints/complaintsAPI';
import { prescriptionsAPI } from '../reducers/prescriptions/prescriptionsAPI';
import { paymentsAPI } from '../reducers/payments/paymentsAPI';
import tokenExpirationMiddleware from '../utils/tokenExpiryMiddleware';
import { servicesAPI } from '../reducers/services/servicesAPI';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  [usersAPI.reducerPath]: usersAPI.reducer,
  [loginAPI.reducerPath]: loginAPI.reducer,
  [doctorsAPI.reducerPath]: doctorsAPI.reducer,
  [appointmentsAPI.reducerPath]: appointmentsAPI.reducer,
  [complaintsAPI.reducerPath]: complaintsAPI.reducer,
  [prescriptionsAPI.reducerPath]: prescriptionsAPI.reducer,
  [paymentsAPI.reducerPath]: paymentsAPI.reducer,
  [servicesAPI.reducerPath]: servicesAPI.reducer,
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(usersAPI.middleware)
      .concat(loginAPI.middleware)
      .concat(doctorsAPI.middleware)
      .concat(appointmentsAPI.middleware)
      .concat(complaintsAPI.middleware)
      .concat(prescriptionsAPI.middleware)
      .concat(paymentsAPI.middleware)
      .concat(servicesAPI.middleware)
      .concat(tokenExpirationMiddleware), // add the token expiration middleware to check if the token is expired before dispatching any action
});

export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
