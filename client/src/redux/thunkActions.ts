import axios from 'axios';
import {
  AllNewsType,
  AuthResponse,
  AuthCheckResponse,
  ILoginInputs,
} from '../types/index';
import { createAsyncThunk } from '@reduxjs/toolkit';

const news_url = 'http://localhost:3001/api/news';
const user_url = 'http://localhost:3001/api/auth';

export const fetchUserLogin = createAsyncThunk<AuthResponse, ILoginInputs>(
  '/login',
  async (user: ILoginInputs) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${user_url}/login`,
        user,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const fetchUserRegister = createAsyncThunk<AuthResponse, ILoginInputs>(
  'auth/registration',
  async (user: ILoginInputs) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${user_url}/registration`,
        user,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const fetchUserLogout = createAsyncThunk<void>('/logout', async () => {
  await axios.get(`${user_url}/logout`, {
    withCredentials: true,
  });
  localStorage.removeItem('token');
});

export const fetchCheckAuth = createAsyncThunk<AuthCheckResponse>(
  '/refresh',
  async () => {
    try {
      const response = await axios.get<AuthCheckResponse>(
        `${user_url}/refresh`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return error.response;
    }
  }
);

//!--

export const fetchAllNews = createAsyncThunk('/news/all', async () => {
  try {
    const response = await axios.get<AllNewsType>(`${news_url}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
});
export const fetchOneNews = createAsyncThunk(
  '/news/id',
  async (id: string | undefined) => {
    try {
      const response = await axios.get<AllNewsType>(`${news_url}/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data[0];
    } catch (error) {
      return error.response;
    }
  }
);

export const fetchAddNews = createAsyncThunk(
  'news/add',
  async (formData: FormData) => {
    try {
      const response = await axios.post(`${news_url}/new`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const fetchUpdateNews = createAsyncThunk(
  'news/put',
  async ({ id, formData }: { id: string; formData: FormData }) => {
    try {
      const response = await axios.put(`${news_url}/edit/${id}`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  }
);

export const fetchDeleteNews = createAsyncThunk(
  'news/del',
  async (id: string): Promise<void> => {
    try {
     const response =  await axios.delete(`${news_url}/remove/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data
    } catch (error) {
      return error.response;

    }
  }
);
