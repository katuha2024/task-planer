import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Встановлюємо базову адресу API
axios.defaults.baseURL = 'https://task-manager-api.goit.global/';

// Утиліта для додавання JWT заголовка
const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// Утиліта для видалення JWT заголовка
const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/users/signup', credentials);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/users/login', credentials);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('/users/logout');
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

/*
 * ВИПРАВЛЕНО: Додано встановлення заголовка перед запитом.
 * Це дозволить програмі "згадати" токен після оновлення сторінки (F5).
 */
export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    // Якщо токена немає, виходимо без запиту
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Unable to fetch user');
    }

    try {
      // КРИТИЧНО: Встановлюємо токен в Axios перед GET-запитом
      setAuthHeader(persistedToken);
      
      // Використовуємо ендпоінт /users/me (якщо буде 401 після F5, замініть на /users/current)
      const res = await axios.get('/users/me'); 
      return res.data;
    } catch (error) {
      // Якщо токен застарів, чистимо заголовки
      clearAuthHeader();
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);