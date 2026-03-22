import React, {useEffect, useState} from "react";
import styles from "./MenuPage.module.css";
import {Category} from "../../../../api/models/dto/category";
import {MenuItem} from "../../../../api/models/dto/menuItem";
import CategoryService from "../../../../api/services/categoryService";
import MenuService from "../../../../api/services/menuService";
import AdminProductCard from "../../../adminProductCard/AdminProductCard";
import {toast, ToastContainer} from "react-toastify";

const MenuPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [itemsByCategory, setItemsByCategory] = useState<Record<number, MenuItem[]>>({});
    const [newCategory, setNewCategory] = useState("");
    const [newItem, setNewItem] = useState<Omit<MenuItem, "id" | "imageUrl">>({
        name: "",
        description: "",
        price: 0,
        categoryId: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
                    } catch (err) {
                        console.error(`Ошибка при загрузке блюд для категории ${cat.id}`, err);
                        groupedItems[cat.id] = [];
                    }
                }

                setItemsByCategory(groupedItems);
            } catch (error) {
                console.error("Ошибка при загрузке категорий и блюд:", error);
            }
        };

        fetchData();
    }, []);

    const addCategory = async () => {
        if (newCategory.trim() === "") return;

        try {
            const response = await CategoryService.create({
                id: 0,
                name: newCategory.trim()
            });

            setCategories([...categories, response.data]);
            setItemsByCategory({
                ...itemsByCategory,
                [response.data.id]: [],
            });

            setNewCategory("");
        } catch (error) {
            console.error("Ошибка при создании категории:", error);
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await CategoryService.delete(id);
            setCategories(categories.filter((cat) => cat.id !== id));
            const updated = { ...itemsByCategory };
            delete updated[id];
            setItemsByCategory(updated);
            toast.success("Категория успешно удалена");
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.error("Невозможно удалить категорию — сначала удалите все блюда из неё.");
            } else {
                console.error("Ошибка при удалении категории:", error);
                toast.error("Произошла ошибка при удалении категории.");
            }
        }
    };


    const addMenuItem = async () => {
        if (!newItem.name || !newItem.description || newItem.price <= 0 || newItem.categoryId === 0 || !imageFile) {
            toast.warn("Пожалуйста, заполните все поля и выберите изображение.");
            return;
        }

        setIsLoading(true); // ← начало загрузки

        try {
            const response = await MenuService.create(newItem as MenuItem, imageFile);
            const item = response.data;

            setItemsByCategory(prev => ({
                ...prev,
                [item.categoryId]: [...(prev[item.categoryId] || []), item],
            }));

            toast.success("Блюдо добавлено");
            setNewItem({ name: "", description: "", price: 0, categoryId: 0 });
            setImageFile(null);
        } catch (error) {
            console.error("Ошибка при добавлении блюда:", error);
            toast.error("Ошибка при добавлении блюда");
        } finally {
            setIsLoading(false); // ← конец загрузки
        }
    };

    const deleteMenuItem = async (id: number) => {
        try {
            await MenuService.delete(id);

            for (const categoryId in itemsByCategory) {
                const items = itemsByCategory[Number(categoryId)];
                if (items.some(item => item.id === id)) {
                    const updated = items.filter(item => item.id !== id);
                    setItemsByCategory({
                        ...itemsByCategory,
                        [categoryId]: updated,
                    });
                    break;
                }
            }
        } catch (error) {
            console.error("Ошибка при удалении блюда:", error);
        }
    };

    return (
        <div className={styles.container}>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <h1>Админ-панель</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Добавить категорию</h2>
                <input
                    className={styles.input}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Название категории"
                />
                <button className={styles.button} onClick={addCategory}>Добавить</button>

                <ul className={styles.list}>
                    {categories.map((cat) => (
                        <li className={styles.listItem} key={cat.id}>
                            {cat.name}
                            <button className={styles.deleteButton} onClick={() => deleteCategory(cat.id)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Добавить блюдо</h2>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Название блюда"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
                <textarea
                    className={styles.textarea}
                    placeholder="Описание"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
                <input
                    className={styles.input}
                    type="number"
                    placeholder="Цена"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                />
                <select
                    className={styles.select}
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({...newItem, categoryId: Number(e.target.value)})}
                >
                    <option value={0}>Выберите категорию</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <input
                    className={styles.input}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <button className={styles.button} onClick={addMenuItem} disabled={isLoading}>
                    {isLoading ? "Добавление..." : "Добавить блюдо"}
                </button>
            </section>

            <section className={styles.section}>
                <h2>Меню по категориям</h2>
                {categories.map((cat) => (
                    <div key={cat.id} className={styles.categoryBlock}>
                        <h3>{cat.name}</h3>
                        <div className={styles.cardGrid}>
                            {(itemsByCategory[cat.id] || []).map((item) => (
                                <AdminProductCard
                                    key={item.id}
                                    title={item.name}
                                    description={item.description}
                                    price={item.price}
                                    imageUrl={item.imageUrl}
                                    onDelete={() => deleteMenuItem(item.id)}
                                />
                            ))}
                        </div>

                    </div>
                ))}
            </section>
        </div>
    );
};

export default MenuPage;
