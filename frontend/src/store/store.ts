import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../store/authSlice";
import cartReducer from "../store/cartSlice"
import addressReducer from "../store/addressSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        address: addressReducer
    },
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;