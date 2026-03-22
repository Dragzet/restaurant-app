import React, {useState} from "react";
import styles from "./PromoCodeInput.module.css";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GiftCertificateService from "../../api/services/giftCertificateService";

interface PromoCodeInputProps {
    total: number;
    onApplyDiscount: (code:string, discount: number) => void;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({total, onApplyDiscount}) => {
    const [code, setCode] = useState("");
    const [applied, setApplied] = useState(false);

    const handleApply = async () => {
        const trimmed = code.trim();

        if (!trimmed) {
            toast.error("Введите промокод");
            return;
        }

        try {
            const response = await GiftCertificateService.getByCode(trimmed);
            const certificate = response.data;

            const discount = Math.min(certificate.amount, total);
            onApplyDiscount(trimmed, discount);
            toast.success(`Промокод применён! Скидка ${discount} ₽`);
            setApplied(true);
        } catch (error: any) {
            onApplyDiscount("",0);
            if (error.response?.status === 404) {
                toast.error("Промокод не найден");
            } else if (error.response?.status === 400) {
                toast.error("Промокод уже использован");
            }
            else {
                toast.error("Ошибка при проверке промокода");
            }
        }
    };

    const handleCancel = () => {
        setCode("");
        setApplied(false);
        onApplyDiscount("",0);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Введите промокод"
                    className={styles.input}
                    disabled={applied}
                />
                {!applied && (
                    <button onClick={handleApply} className={styles.button} disabled={applied}>
                        Применить
                    </button>
                )}

                {applied && (
                    <button onClick={handleCancel} className={styles.cancelButton}>
                        Отменить
                    </button>
                )}
            </div>
        </div>
    );
};

export default PromoCodeInput;
