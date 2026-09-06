import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";

import { baseApi } from "./api/baseApi";
import { authReducer, persistedAuthState, signOut } from "./features/auth/authSlice";

export function makeStore() {
  const authListener = createListenerMiddleware();
  authListener.startListening({
    actionCreator: signOut,
    effect: (_, api) => {
      api.dispatch(baseApi.util.resetApiState());
    },
  });

  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(authListener.middleware).concat(baseApi.middleware),
    preloadedState: {
      auth: persistedAuthState(),
    },
  });
}

export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
