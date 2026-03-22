import React from "react";
import styles from "./AddressPopup.module.css";

type Props = {
    onClose: () => void;
};

const AddressPopup: React.FC<Props> = ({ onClose }) => {
    return (
        <div className={styles.popup}>
            <p className={styles.title}>
                Укажи адрес, чтобы увидеть актуальные цены и товары
            </p>
            <button className={styles.button}>Указать адрес доставки</button>
        </div>
    );
};

export default AddressPopup;