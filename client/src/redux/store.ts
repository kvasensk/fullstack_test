import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit';
import newsSlice, { NewsSliceState } from './newsSlice';
import userSlice, { UserSliceState } from './userSlice';
import modalSlice, { ModalSliceState } from './modalSlice';
import redactorSlice, { RedactorSliceState } from './redactorSlice';

type StoreType = {
  newsSlice: NewsSliceState;
  userSlice: UserSliceState;
  modalSlice: ModalSliceState;
  redactorSlice: RedactorSliceState;
};

const storeOptions: ConfigureStoreOptions<StoreType> = {
  reducer: {
    newsSlice,
    userSlice,
    modalSlice,
    redactorSlice,
  },
};

export const store = configureStore(storeOptions);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
