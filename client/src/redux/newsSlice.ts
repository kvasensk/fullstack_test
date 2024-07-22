import { createSlice } from '@reduxjs/toolkit';
import { fetchAllNews, fetchAddNews, fetchOneNews } from './thunkActions';
import { AllNewsType, INews } from '../types';

export type NewsSliceState = {
  news: AllNewsType;
  isLoading: boolean;
  editing_news?: INews | undefined;
  add_error: string | null;
};

const initialState: NewsSliceState = {
  news: [],
  isLoading: true,
  add_error: null,
};

const newsSlice = createSlice({
  name: 'newsSlice',
  initialState,
  reducers: {
    dropError: state => {
      state.add_error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAllNews.pending, (state: NewsSliceState) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchAllNews.fulfilled,
      (state: NewsSliceState, { payload }) => {
        if (payload) {
          state.news = payload;
        }
        state.isLoading = false;
      }
    );
    builder.addCase(fetchAddNews.pending, (state: NewsSliceState) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchAddNews.fulfilled,
      (state: NewsSliceState, { payload }) => {
        if (!payload.message) {
          state.news.push(payload);
          state.add_error = null;
        } else {
          state.add_error = payload.message;
        }
        state.isLoading = false;
      }
    );
    builder.addCase(fetchOneNews.pending, (state: NewsSliceState) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchOneNews.fulfilled,
      (state: NewsSliceState, payload) => {
        if (payload) {
          state.editing_news = payload.payload;
          state.isLoading = false;
        }
      }
    );
  },
});

export const { dropError } = newsSlice.actions;
export default newsSlice.reducer;
