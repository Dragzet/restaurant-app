import React, { useEffect, useRef, useState } from "react";
import styles from "./Main.module.css";

import 'react-loading-skeleton/dist/skeleton.css';
import ProductCard from "../../productCard/ProductCard";
import { Skeleton } from "@mui/material";
import MenuService from "../../../api/services/menuService";
import { MenuItem } from "../../../api/models/dto/menuItem";
import CategoryService from "../../../api/services/categoryService";
import { Category } from "../../../api/models/dto/category";
import CategoryNav from "../../categoryNav/CategoryNav";
import SideCart from "../../sideCart/SideCart";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addToCart, removeFromCart, changeQuantity } from "../../../store/cartSlice";
import {toast, ToastContainer} from "react-toastify";
import CustomToast from "../../ui/customToast/CustomToast";
import {useNavigate} from "react-router-dom";

const Main: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [itemsByCategory, setItemsByCategory] = useState<Record<number, MenuItem[]>>({});
    const [loading, setLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const [isCartOpen, setIsCartOpen] = useState(false);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleAddToCart = (item: MenuItem) => {
        dispatch(addToCart({
            id: item.id,
            title: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: 1,
        }));
        toast(<CustomToast title="Добавлено:" description={`${item.name}`} />, {
            autoClose: 1000,
            closeButton: false,
            hideProgressBar: true,
            position: "top-right",
            style: {
                background: "rgba(0, 0, 0, 0.85)", // ← чёрный с прозрачностью
                boxShadow: "none",
                padding: "12px 16px",
                color: "white",
                borderRadius: "12px",
                marginTop: isSticky ? 60 : 120, // ← можно точно подогнать под высоту CategoryNav
            },
        });

    };

    const handleRemove = (id: number) => {
        dispatch(removeFromCart(id));
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        dispatch(changeQuantity({ id, quantity }));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await CategoryService.getAll(false);
                const loadedCategories = catRes.data;
                setCategories(loadedCategories);

                const groupedItems: Record<number, MenuItem[]> = {};
                for (const cat of loadedCategories) {
                    try {
                        const { data } = await MenuService.getAll(cat.id);
                        groupedItems[cat.id] = data;
                    } catch {
                        groupedItems[cat.id] = [];
                    }
                }

                setItemsByCategory(groupedItems);
            } catch (error) {
                console.error("Ошибка при загрузке:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsSticky(!entry.isIntersecting),
            { rootMargin: "0px", threshold: 0 }
        );

        const sentinelEl = sentinelRef.current;
        if (sentinelEl) observer.observe(sentinelEl);
        return () => {
            if (sentinelEl) observer.unobserve(sentinelEl);
        };
    }, []);

    const scrollToCategory = (id: number) => {
        const el = document.getElementById(`category-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar
                closeButton={false}
                newestOnTop
                draggable={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />

            <div ref={sentinelRef} />
            <CategoryNav
                categories={categories}
                isSticky={isSticky}
                onSelect={scrollToCategory}
                onBucket={() => setIsCartOpen(!isCartOpen)}
            />
            <div className={styles.container}>
                {categories.map((cat) => (
                    <section key={cat.id} id={`category-${cat.id}`} className={styles.categoryBlock}>
                        <h1 style={{ padding: "16px" }}>{cat.name}</h1>
                        <div className={styles.cardGrid}>
                            {loading
                                ? Array(3).fill(0).map((_, idx) => (
                                    <Skeleton key={idx} height={400} width={320} />
                                ))
                                : (itemsByCategory[cat.id] || []).map((item) => (
                                    <ProductCard
                                        key={item.id}
                                        title={item.name}
                                        description={item.description}
                                        price={item.price}
                                        imageUrl={item.imageUrl}
                                        onAddToCart={() => handleAddToCart(item)}
                                    />
                                ))}
                        </div>
                    </section>
                ))}
            </div>
            <SideCart
                isOpen={isCartOpen}
                items={cartItems}
                onClose={() => setIsCartOpen(false)}
                onRemove={handleRemove}
                onCheckout={() => navigate("/checkout")}
                onQuantityChange={handleQuantityChange}
            />
        </div>
    );
};

export default Main;
