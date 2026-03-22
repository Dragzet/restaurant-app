import React from "react";
import styles from "./CartItemCard.module.css";

type CartItem = {
    id: number;
    title: string;
    quantity: number;
    price: number;
    imageUrl: string;
};

interface CartItemCardProps {
    item: CartItem;
    onRemove: (id: number) => void;
    onQuantityChange: (id: number, quantity: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove, onQuantityChange }) => {
    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, item.quantity - 1);
        } else {
            onRemove(item.id);
        }
    };

    const handleIncrease = () => {
        onQuantityChange(item.id, item.quantity + 1);
    };

    return (
        <li className={styles.card}>
            <img src={item.imageUrl} alt={item.title} className={styles.image} />
            <div className={styles.info}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.subtitle}>30 см, традиционное тесто</div>
            </div>
            <button className={styles.remove} onClick={() => onRemove(item.id)}>×</button>

            <div className={styles.bottom}>
                <span className={styles.price}>{item.price * item.quantity} ₽</span>
                <div className={styles.controls}>
                    <button className={styles.decrease} onClick={handleDecrease}>−</button>
                    <span>{item.quantity}</span>
                    <button className={styles.increase} onClick={handleIncrease}>+</button>
                </div>
            </div>
        </li>
    );
};

export default CartItemCard;
