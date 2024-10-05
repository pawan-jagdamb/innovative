import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from './user/userSlice'

export const store = configureStore({
  reducer: {user:userReducer}, // it handles events
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:false,
  }),
})