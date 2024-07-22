import { createSlice } from '@reduxjs/toolkit';

export type RedactorSliceState = {
  code: string;
  pubDate: string;
};

const initialState: RedactorSliceState = {
  code: ``,
  pubDate: new Date().toString(),
};

const redactorSlice = createSlice({
  name: 'redactorSlice',
  initialState,
  reducers: {
    setRedactorValue: (state, { payload }) => {
      state.code = payload;
    },
    setRedactorValueDefault: state => {
      state.code = ``;
    },
    setDateValue: (state, { payload }) => {
      state.pubDate = payload;
    },
    setDateValueDefault: state => {
      state.pubDate = new Date().toString();
    },
  },
});

export default redactorSlice.reducer;
export const {
  setRedactorValue,
  setRedactorValueDefault,
  setDateValue,
  setDateValueDefault,
} = redactorSlice.actions;
