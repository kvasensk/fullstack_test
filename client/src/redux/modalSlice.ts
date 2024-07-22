import { createSlice } from '@reduxjs/toolkit';

export type ModalSliceState = {
  openModal: boolean;
};

const initialState: ModalSliceState = {
  openModal: false,
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    openModalLogin: state => {
      state.openModal = true;
    },
    closeModalLogin: state => {
      state.openModal = false;
    },
  },
});

export default modalSlice.reducer;
export const { openModalLogin, closeModalLogin } = modalSlice.actions;
