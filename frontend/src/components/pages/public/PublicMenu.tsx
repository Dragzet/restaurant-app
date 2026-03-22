import React, { useEffect, useRef, useState } from "react";
import styles from "./PublicMenu.module.css";
import 'react-loading-skeleton/dist/skeleton.css';
import ProductCard from "../../productCard/ProductCard";
import { Skeleton } from "@mui/material";
import MenuService from "../../../api/services/menuService";
import { MenuItem } from "../../../api/models/dto/menuItem";
import CategoryService from "../../../api/services/categoryService";
import { Category } from "../../../api/models/dto/category";
import CategoryNav from "../../categoryNav/CategoryNav";
import {toast, ToastContainer} from "react-toastify";
import CustomToast from "../../ui/customToast/CustomToast";
import {useNavigate} from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PublicMenu: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [itemsByCategory, setItemsByCategory] = useState<Record<number, MenuItem[]>>({});
    const [loading, setLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await CategoryService.getAll(true);
                setCategories(categoriesRes.data);

                const itemsByCategory: Record<number, MenuItem[]> = {};
                for (const category of categoriesRes.data) {
                    const itemsRes = await MenuService.getAll(category.id);
                    itemsByCategory[category.id] = itemsRes.data;
                }
                setItemsByCategory(itemsByCategory);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                toast.error("Ошибка загрузки меню");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const observer = new IntersectionObserver(([entry]) => {
            setIsSticky(!entry.isIntersecting);
        });

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ padding: "20px 0" }}>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{ marginBottom: "20px", color: "#000" }}
                >
                    Назад
                </Button>
                <Typography variant="h4" gutterBottom sx={{ marginBottom: "30px" }}>
                    Меню
                </Typography>
            </Box>

            <div ref={sentinelRef}></div>
            
            {!loading && categories.length > 0 && (
                <CategoryNav 
                    categories={categories} 
                    isSticky={isSticky}
                    onSelect={(id: number) => {
                        const element = document.getElementById(`category-${id}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    onBucket={() => navigate("/cart")}
                />
            )}

            <div className={styles.menuContainer}>
                {loading ? (
                    <div className={styles.skeletsContainer}>
                        {Array(8).fill(null).map((_, i) => (
                            <Skeleton 
                                key={i} 
                                variant="rectangular" 
                                width="100%" 
                                height={250}
                                sx={{ borderRadius: "8px" }}
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        {categories.map((category) => (
                            <div key={category.id} id={`category-${category.id}`} className={styles.categorySection}>
                                <h2 className={styles.categoryTitle}>{category.name}</h2>
                                <div className={styles.productsGrid}>
                                    {itemsByCategory[category.id]?.map((item) => (
                                        <ProductCard 
                                            key={item.id} 
                                            item={item}
                                            onAddToCart={() => {
                                                toast(<CustomToast title="Внимание:" description="Пожалуйста, войдите или зарегистрируйтесь, чтобы добавить товар в корзину" />, {
                                                    autoClose: 2000,
                                                    closeButton: false,
                                                    hideProgressBar: true,
                                                    position: "top-right",
                                                    style: {
                                                        background: "rgba(0, 0, 0, 0.85)",
                                                        boxShadow: "none",
                                                        padding: "12px 16px",
                                                    },
                                                });
                                                navigate("/login");
                                            }}
                                            isGuest={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <ToastContainer />
        </Container>
    );
};

export default PublicMenu;

