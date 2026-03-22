import React from "react";
import styles from "./SideCart.module.css";
import CartItemCard from "../cartItemCard/CartItemCard";

type CartItem = {
    id: number;
    title: string;
    quantity: number;
    price: number;
    imageUrl: string;
};

interface SideCartProps {
    isOpen: boolean;
    items: CartItem[];
    onClose: () => void;
    onRemove: (id: number) => void;
    onCheckout: () => void;
    onQuantityChange: (id: number, quantity: number) => void;
}

const SideCart: React.FC<SideCartProps> = ({
                                               isOpen,
                                               items,
                                               onClose,
                                               onRemove,
                                               onCheckout,
                                               onQuantityChange
                                           }) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} onClick={onClose}>
            <div className={styles.cart} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Корзина</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                {items.length === 0 ? (
                    <p className={styles.empty}>Корзина пуста</p>
                ) : (
                    <>
                        <ul className={styles.itemList}>
                            {items.map((item) => (
                                <CartItemCard
                                    key={item.id}
                                    item={item}
                                    onRemove={onRemove}
                                    onQuantityChange={onQuantityChange}
                                />
                            ))}
                        </ul>

                        <div className={styles.footer}>
                            <div className={styles.total}>
                                <span>Итого:</span>
                                <span>{total} ₽</span>
                            </div>
                            <button className={styles.checkoutBtn} onClick={onCheckout}>
                                Перейти к оплате
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SideCart;
