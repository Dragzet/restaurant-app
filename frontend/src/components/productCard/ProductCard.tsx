import React from "react";
import styles from "./ProductCard.module.css";
import { MenuItem } from "../../api/models/dto/menuItem";


type ProductCardProps = {
    title?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    item?: MenuItem;
    onAddToCart?: () => void;
    isGuest?: boolean;
};


const ProductCard: React.FC<ProductCardProps> = ({
                                                     title,
                                                     description,
                                                     price,
                                                     imageUrl,
                                                     item,
                                                     onAddToCart,
                                                     isGuest = false
                                                 }) => {
    // Используем либо переданные параметры, либо данные из item
    const cardTitle = title || item?.name || "Блюдо";
    const cardDescription = description || item?.description || "";
    const cardPrice = price || item?.price || 0;
    const cardImage = imageUrl || item?.imageUrl || "";

    return (
        <div className={styles.card}>
            <img src={cardImage} alt={cardTitle} className={styles.image}/>
            <div className={styles.info}>
                <h2 className={styles.title}>{cardTitle}</h2>
                <p className={styles.description}>{cardDescription}</p>
            </div>
            <div className={styles.footer}>
                <span className={styles.price}>от {cardPrice} ₽</span>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onAddToCart) {
                            onAddToCart();
                        }
                    }}
                    className={styles.button}
                >
                    {isGuest ? "Войдите" : "Выбрать"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;