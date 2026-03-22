import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import styles from "./GiftCardPage.module.css";
import GiftCertificateService from "../../../api/services/giftCertificateService";
import { GiftCertificateRequest } from "../../../api/models/request/giftCertificateRequest";
import { GiftCertificateResponse } from "../../../api/models/response/giftCertificateResponse";

const giftOptions = [
    { id: 1, value: 500 },
    { id: 2, value: 1000 },
    { id: 3, value: 2000 },
];

const GiftCardPage: React.FC = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [email, setEmail] = useState("");
    const [purchased, setPurchased] = useState<GiftCertificateResponse[]>([]);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await GiftCertificateService.getMine();
            setPurchased(response.data);
            localStorage.setItem("giftCards", JSON.stringify(response.data));
        } catch (error) {
            toast.error("Не удалось загрузить сертификаты");
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedId) {
            toast.error("Выберите номинал сертификата");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Введите корректный e-mail");
            return;
        }

        const selectedValue = giftOptions.find(g => g.id === selectedId)?.value || 0;

        const request: GiftCertificateRequest = {
            amount: selectedValue,
            receiverEmail: email,
        };

        try {
            const response = await GiftCertificateService.create(request);
            toast.success("Сертификат отправлен на e-mail!");

            const newCard = response.data;
            const updated = [newCard, ...purchased];
            setPurchased(updated);
            localStorage.setItem("giftCards", JSON.stringify(updated));

            setSelectedId(null);
            setEmail("");
        } catch (error) {
            toast.error("Ошибка при покупке сертификата");
            console.error(error);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Подарочные сертификаты</h1>

            <div className={styles.options}>
                {giftOptions.map(option => (
                    <button
                        key={option.id}
                        className={`${styles.option} ${selectedId === option.id ? styles.active : ""}`}
                        onClick={() => setSelectedId(option.id)}
                    >
                        {option.value} ₽
                    </button>
                ))}
            </div>

            <div className={styles.inputWrapper}>
                <TextField
                    label="Email получателя"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleSubmit}
                className={styles.submitBtn}
            >
                Оплатить
            </Button>

            {purchased.length > 0 && (
                <div className={styles.history}>
                    <h2>Купленные сертификаты</h2>
                    <ul className={styles.cardList}>
                        {purchased.map((card, index) => (
                            <li key={index} className={styles.card}>
                                <div>
                                    <strong>{card.amount} ₽</strong> — {card.receiverEmail}
                                </div>
                                <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GiftCardPage;
