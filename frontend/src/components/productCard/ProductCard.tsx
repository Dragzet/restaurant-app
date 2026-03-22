import React from "react";
import styles from "./ProductCard.module.css";


type ProductCardProps = {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    onAddToCart?: () => void;
};


const ProductCard: React.FC<ProductCardProps> = ({
                                                     title,
                                                     description,
                                                     price,
                                                     imageUrl,
                                                     onAddToCart
                                                 }) => {
    return (
        <div className={styles.card}>
            <img src={imageUrl} alt={title} className={styles.image}/>
            <div className={styles.info}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.footer}>
                <span className={styles.price}>от {price} ₽</span>
                <button onClick={onAddToCart} className={styles.button}>Выбрать</button>
            </div>
        </div>
    );
};

export default ProductCard;