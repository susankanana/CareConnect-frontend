import type { Middleware } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../../src/reducers/login/userSlice';

const tokenExpirationMiddleware: Middleware = (store) => (next) => (action) => {
  const state = store.getState();
  const token = state.user.token;

  if (token) {
    console.log(`Token exists: ${token}`);
    try {
      const { exp } = jwtDecode(token) as { exp: number };
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (exp < currentTime) {
        console.log('Token has expired, dispatching logout action.');
        store.dispatch(logout());
      } else {
        console.log('Token is valid, proceeding with action.');
        next(action);
      }
    } catch (error) {
      console.error('Error processing token:', error);
    }
  }
  return next(action); //happens when no token is present or if the action is not related to token expiration
};

export default tokenExpirationMiddleware;
