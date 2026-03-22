import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
    id: number;
    title: string;
    quantity: number;
    price: number;
    imageUrl: string;
};

interface CartState {
    items: CartItem[];
}

const loadFromLocalStorage = (): CartItem[] => {
    try {
        const data = localStorage.getItem("cart");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveToLocalStorage = (items: CartItem[]) => {
    try {
        localStorage.setItem("cart", JSON.stringify(items));
    } catch {
        // ignore
    }
};

const initialState: CartState = {
    items: loadFromLocalStorage(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existing = state.items.find(i => i.id === action.payload.id);
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push({ ...action.payload });
            }
            saveToLocalStorage(state.items);
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(i => i.id !== action.payload);
            saveToLocalStorage(state.items);
        },
        changeQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) item.quantity = action.payload.quantity;
            saveToLocalStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveToLocalStorage([]);
        },
    },
});

export const { addToCart, removeFromCart, changeQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
