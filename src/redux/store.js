import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { tasksReducer } from './tasks/slice';
import { authReducer } from './auth/slice';

// Виправляємо проблему з імпортом storage у Vite
const persistStorage = storage.default ? storage.default : storage;

const authPersistConfig = {
  key: 'auth',
  storage: persistStorage, // використовуємо виправлений об'єкт
  whitelist: ['token'],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // Замість складного globalThis використовуємо нативний інструмент Vite
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);