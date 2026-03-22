import React, { useState } from "react";
import styles from "./AddressFormPopup.module.css";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import {Address} from "../../store/addressSlice";

interface Suggestion {
    title: string;
    formatted_address: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (address: Address) => void;  // Функция теперь принимает объект Address
}

const AddressFormPopup: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);

    const [entrance, setEntrance] = useState("");
    const [doorCode, setDoorCode] = useState("");
    const [floor, setFloor] = useState("");
    const [flat, setFlat] = useState("");
    const [comment, setComment] = useState("");

    const fetchSuggestions = async (input: string) => {
        if (input.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(process.env.REACT_APP_SUGGEST_URL ?? "", {
                params: {
                    apikey: process.env.REACT_APP_SUGGEST_API_KEY,
                    text: input,
                    lang: "ru_RU",
                    results: 5,
                    print_address: 1
                },
            });

            if (response.data && response.data.results) {
                const formatted = response.data.results.map((r: any) => ({
                    title: r.title.text,
                    formatted_address: r.address.formatted_address,
                }));
                setSuggestions(formatted);
            } else {
                setSuggestions([]);
            }
        } catch (e) {
            console.error("Ошибка при автодополнении", e);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        fetchSuggestions(val);
    };

    const handleSelect = (_: any, value: Suggestion | null) => {
        if (value) setQuery(value.formatted_address);
    };

    const handleSubmit = () => {
        const fullAddress: Address = {
            address: query,
            floor: parseInt(floor, 10),
            entrance,
            apartmentNumber: parseInt(flat, 10),
            intercomCode: doorCode,
            notes: comment,
            lat: 0, // координаты нужно получить через геокодирование
            lng: 0, // координаты нужно получить через геокодирование
        };
        onSubmit(fullAddress); // Передаем объект Address
        onClose();
    };

    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Укажите ваш адрес</h2>
                <div className={styles.formGrid}>
                    <Autocomplete
                        disablePortal
                        options={suggestions}
                        getOptionLabel={(opt) => opt.formatted_address}
                        onChange={handleSelect}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Город, улица и дом"
                                value={query}
                                onChange={handleChange}
                                className={styles.inputFull}
                                size="small"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading && <CircularProgress color="inherit" size={18} />}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <TextField label="Подъезд" value={entrance} onChange={(e) => setEntrance(e.target.value)} className={styles.inputHalf} size="small" />
                    <TextField label="Код двери" value={doorCode} onChange={(e) => setDoorCode(e.target.value)} className={styles.inputHalf} size="small" />
                    <TextField label="Этаж" value={floor} onChange={(e) => setFloor(e.target.value)} className={styles.inputHalf} size="small" />
                    <TextField label="Квартира" value={flat} onChange={(e) => setFlat(e.target.value)} className={styles.inputHalf} size="small" />
                    <TextField label="Комментарий к адресу" value={comment} onChange={(e) => setComment(e.target.value)} className={styles.inputFull} size="small" />
                </div>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancel}>Отмена</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!query.trim()}
                        className={styles.submit}
                        style={{ opacity: !query.trim() ? 0.6 : 1 }}
                    >
                        Заказать сюда
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressFormPopup;
