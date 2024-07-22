import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchUserLogin,
  fetchUserRegister,
  fetchUserLogout,
  fetchCheckAuth,
} from './thunkActions';
import { AuthCheckResponse, AuthResponse } from '../types';

export type UserSliceState = {
  username: string;
  _id: string;
  isAuth: boolean;
  error: string | null;
};

const initialState: UserSliceState = {
  username: '',
  _id: '',
  isAuth: false,
  error: null,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchUserLogin.fulfilled,
      (state: UserSliceState, action: PayloadAction<AuthResponse>) => {
        const payload = action.payload;
        if (payload.message) {
          state.error = payload.errors
            ? `${payload.message}:${payload.errors.errors[0].msg}`
            : payload.message;
        } else {
          localStorage.setItem('token', payload.tokens.accessToken);
          state.username = payload.user.username;
          state.isAuth = true;
          state._id = payload.user._id;
          state.error = null;
        }
      }
    );
    builder.addCase(
      fetchUserRegister.fulfilled,
      (state: UserSliceState, action: PayloadAction<AuthResponse>) => {
        const payload = action.payload;
        if (payload.message) {
          state.error = payload.errors
            ? `${payload.message}:${payload.errors.errors[0].msg}`
            : payload.message;
        } else {
          localStorage.setItem('token', payload.tokens.accessToken);
          state.username = payload.user.username;
          state.isAuth = true;
          state._id = payload.user._id;
          state.error = null;
        }
      }
    );
    builder.addCase(fetchUserLogout.fulfilled, state => {
      state.username = '';
      state.isAuth = false;
      state._id = '';
      state.error = null;
    });
    builder.addCase(
      fetchCheckAuth.fulfilled,
      (state: UserSliceState, action: PayloadAction<AuthCheckResponse>) => {
        const payload = action.payload;
        state.username = payload.user.username;
        state._id = payload.user._id;
        state.isAuth = true;
        state.error = null;
      }
    );
  },
});

export default userSlice.reducer;
