import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer } from 'redux-persist'
import { version } from 'react'
import storage from 'redux-persist/lib/storage'
import { persistStore } from 'redux-persist'



const rootReducer = combineReducers({
  user: userReducer,

})
const persistConfig = {
  key: 'root',
  storage,
  version:1,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  // reducer: {user: userReducer},
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store) 