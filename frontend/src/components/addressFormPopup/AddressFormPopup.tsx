import React, { useState, useMemo } from "react";
import styles from "./AddressFormPopup.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {Address} from "../../store/addressSlice";

// Популярные адреса в Москве для подсказок
const POPULAR_ADDRESSES = [
    "Москва, ул. Пушкина, д. 1",
    "Москва, ул. Ленина, д. 1",
    "Москва, Красная площадь, д. 1",
    "Москва, ул. Арбат, д. 1",
    "Москва, ул. Тверская, д. 1",
    "Москва, ул. Невский проспект, д. 1",
    "Москва, ул. Горкого, д. 1",
    "Москва, ул. Красного октября, д. 1",
    "Санкт-Петербург, Невский проспект, д. 1",
    "Санкт-Петербург, ул. Садовая, д. 1",
];

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (address: Address) => void;
}

const AddressFormPopup: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [address, setAddress] = useState("");
    const [entrance, setEntrance] = useState("");
    const [doorCode, setDoorCode] = useState("");
    const [floor, setFloor] = useState("");
    const [flat, setFlat] = useState("");
    const [comment, setComment] = useState("");

    // Фильтруем подсказки на основе ввода пользователя
    const filteredSuggestions = useMemo(() => {
        if (!address || address.length < 2) return [];
        return POPULAR_ADDRESSES.filter(addr =>
            addr.toLowerCase().includes(address.toLowerCase())
        );
    }, [address]);

    const handleSubmit = () => {
        if (!address.trim()) {
            alert("Пожалуйста, укажите адрес");
            return;
        }

        const fullAddress: Address = {
            address: address,
            floor: floor ? parseInt(floor, 10) : 0,
            entrance: entrance || "",
            apartmentNumber: flat ? parseInt(flat, 10) : 0,
            intercomCode: doorCode || "",
            notes: comment || "",
            lat: 55.7558,
            lng: 37.6173,
        };
        onSubmit(fullAddress);
        onClose();
    };

    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Укажите ваш адрес</h2>
                <div className={styles.formGrid}>
                    <Autocomplete
                        freeSolo
                        options={filteredSuggestions}
                        value={address}
                        onChange={(_, value) => setAddress(value || "")}
                        inputValue={address}
                        onInputChange={(_, value) => setAddress(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Город, улица и дом"
                                className={styles.inputFull}
                                size="small"
                                placeholder="Начните вводить адрес..."
                            />
                        )}
                    />
                    <TextField 
                        label="Подъезд" 
                        value={entrance} 
                        onChange={(e) => setEntrance(e.target.value)} 
                        className={styles.inputHalf} 
                        size="small" 
                    />
                    <TextField 
                        label="Код двери" 
                        value={doorCode} 
                        onChange={(e) => setDoorCode(e.target.value)} 
                        className={styles.inputHalf} 
                        size="small" 
                    />
                    <TextField 
                        label="Этаж" 
                        value={floor} 
                        onChange={(e) => setFloor(e.target.value)} 
                        className={styles.inputHalf} 
                        size="small" 
                        type="number"
                    />
                    <TextField 
                        label="Квартира" 
                        value={flat} 
                        onChange={(e) => setFlat(e.target.value)} 
                        className={styles.inputHalf} 
                        size="small"
                        type="number"
                    />
                    <TextField 
                        label="Комментарий к адресу" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        className={styles.inputFull} 
                        size="small" 
                    />
                </div>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancel}>Отмена</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!address.trim()}
                        className={styles.submit}
                        style={{ opacity: !address.trim() ? 0.6 : 1 }}
                    >
                        Сохранить адрес
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressFormPopup;
