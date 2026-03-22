import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Интерфейс для адреса
export interface Address {
    address: string;
    floor: number;
    entrance: string;
    apartmentNumber: number;
    intercomCode: string;
    notes: string;
    lat: number;
    lng: number;
}

// Интерфейс для состояния адресов
interface AddressState {
    list: Address[];
    selected: Address | null;
}

// Функция для получения состояния из localStorage
const loadStateFromLocalStorage = (): AddressState => {
    const savedState = localStorage.getItem("addressState");
    if (savedState) {
        return JSON.parse(savedState);
    }
    return {
        list: [],
        selected: null,
    };
};

// Инициализация состояния с учетом данных из localStorage
const initialState: AddressState = loadStateFromLocalStorage();

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        addAddress: (state, action: PayloadAction<Address>) => {
            state.list.push(action.payload);
            state.selected = action.payload;
            // Сохраняем состояние в localStorage
            localStorage.setItem("addressState", JSON.stringify(state));
        },
        deleteAddress: (state, action: PayloadAction<Address>) => {
            // Удаляем по полному объекту Address
            state.list = state.list.filter(addr => addr.address !== action.payload.address);
            if (state.selected?.address === action.payload.address) {
                state.selected = state.list[0] || null;
            }
            // Обновляем localStorage
            localStorage.setItem("addressState", JSON.stringify(state));
        },
        selectAddress: (state, action: PayloadAction<Address>) => {
            // Выбираем по полному объекту Address
            const found = state.list.find(addr => addr.address === action.payload.address);
            if (found) state.selected = found;
            // Обновляем localStorage
            localStorage.setItem("addressState", JSON.stringify(state));
        },
        replace: (state, action: PayloadAction<AddressState>) => {
            state = action.payload;
            // Обновляем localStorage
            localStorage.setItem("addressState", JSON.stringify(state));
            return state;
        }
    },
});

export const { addAddress, deleteAddress, selectAddress, replace } = addressSlice.actions;
export default addressSlice.reducer;
