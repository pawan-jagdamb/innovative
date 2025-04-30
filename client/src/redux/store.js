import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  userReducer  from './user/userSlice';
import authReducer from './user/authSlice'
import { persistReducer } from 'redux-persist';
import { version } from 'mongoose';
import messageReducer from "./user/messageSlice.js"
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';
import socketReducer from "./user/socketSlice.js"

const rootReducer= combineReducers({user:userReducer,
  auth:authReducer,
  message:messageReducer,
  socket:socketReducer
});

const persistConfig={
  key:'root',
  storage,
  version:1,
}

const persistedReducer=persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer, // it handles events
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:false,
  }),
});
export const persistor = persistStore(store);