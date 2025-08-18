import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  PERSIST,
  REHYDRATE,
  REGISTER,
  FLUSH,
  PAUSE,
  PURGE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import moviesReducer from "./Slice/moviesSlice";
import ordersReducer from "./Slice/orderSlice";
import authReducer from './Slice/authSlice'

const persistConfig = {
  key: "tickitz:redux",
  storage,
  blacklist: [],
};

const rootReducer = combineReducers({
  movies: moviesReducer,
  orders: ordersReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [PERSIST, REHYDRATE, REGISTER, FLUSH, PAUSE, PURGE],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
