import React from "react";
import styles from "./AdminProductСard.module.css";

type AdminProductCardProps = {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    onDelete: () => void;
};

const AdminProductCard: React.FC<AdminProductCardProps> = ({
                                                               title,
                                                               description,
                                                               price,
                                                               imageUrl,
                                                               onDelete,
                                                           }) => {
    return (
        <div className={styles.card}>
            <img src={imageUrl} alt={title} className={styles.image} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button onClick={onDelete} className={styles.deleteButton}>✕</button>
                </div>
                <p className={styles.description}>{description}</p>
                <div className={styles.footer}>
                    <span className={styles.price}>{price.toFixed(2)} ₽</span>
                </div>
            </div>
        </div>
    );
};

export default AdminProductCard;
