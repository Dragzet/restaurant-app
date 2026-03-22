import React from "react";
import styles from "./CategoryNav.module.css";
import { Category } from "../../api/models/dto/category";
import { FaShoppingBasket as BasketIconRaw } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store"; // путь подкорректируй под свой проект

const BasketIcon = BasketIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

interface CategoryNavProps {
    categories: Category[];
    isSticky: boolean;
    onSelect: (id: number) => void;
    onBucket: () => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, isSticky, onSelect, onBucket }) => {
    const totalQuantity = useSelector((state: RootState) =>
        state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    );

    return (
        <div className={`${styles.categoryNav} ${isSticky ? styles.sticky : ""}`}>
            <div className={styles.left}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={styles.categoryBtn}
                        onClick={() => onSelect(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
            <div className={styles.right}>
                <button onClick={onBucket} className={styles.cartButton}>
                    <BasketIcon className={styles.icon} />
                    <span className={styles.cartText}>Корзина</span>
                    <span className={styles.divider}></span>
                    <span className={styles.cartCount}>{totalQuantity}</span>
                </button>
            </div>
        </div>
    );
};

export default CategoryNav;
