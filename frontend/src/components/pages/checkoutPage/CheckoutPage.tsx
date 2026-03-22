import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import PromoCodeInput from "../../promoCodeInput/PromoCodeInput";
import styles from "./CheckoutPage.module.css";
import {toast, ToastContainer} from "react-toastify";
import DeliveryAddressSelector from "../../deliverySelector/DeliveryAddressSelector";
import {Address} from "../../../store/addressSlice";
import {RootState} from "../../../store/store";
import {User} from "../../../api/models/dto/user";
import UserService from "../../../api/services/userService";
import BonusSelector from "../../bonusSelector/BonusSelector";
import {OrderAddress, OrderItemsRequest, OrderRequest} from "../../../api/models/request/orderRequest";
import OrderService from "../../../api/services/orderService";
import {useNavigate} from "react-router-dom";



const CheckoutPage: React.FC = () => {
    const items = useSelector((state: RootState) => state.cart.items);
    const [discount, setDiscount] = useState(0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [isOpen, setIsOpen] = useState(false); // для открытия модального окна выбора адреса
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(useSelector((state: RootState) => state.address.selected)); // храним выбранный адрес
    const [user, setUser] = useState<User | null>(null);
    const [usedBonuses, setUsedBonuses] = useState(0);
    const finalTotal = total - discount - usedBonuses;
    const [code, setCode] = useState("");

    const navigate = useNavigate()


    const handlePromo = (code: string, discount: number) => {
        setDiscount(discount);
        setCode(code);
    }

    const handlePay = async () => {
        if (items.length === 0) {
            toast.error("Ваша корзина пуста.");
            return;
        }

        if (!selectedAddress) {
            toast.error("Пожалуйста, выберите адрес доставки.");
            return;
        }

        const orderItems: OrderItemsRequest[] = items.map(item => ({
            id: item.id,
            quantity: item.quantity
        }));

        const orderAddress: OrderAddress = {
            address: selectedAddress.address,
            floor: selectedAddress.floor,
            apartmentNumber: selectedAddress.apartmentNumber,
            intercomCode: selectedAddress.intercomCode,
            notes: selectedAddress.notes
        };

        const request: OrderRequest = {
            orderItems,
            orderAddress,
            code: code,
            usedBonuses
        };

        try {
            await OrderService.create(request);
            toast.success(`Оплата прошла успешно! Доставка по адресу: ${selectedAddress.address}`);
            navigate("/orders")

        } catch (error) {
            toast.error("Ошибка при оформлении заказа");
            console.error("Order create error", error);
        }
    };



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await UserService.getMe();
                setUser(response.data);
            } catch (error) {
                toast.error("Не удалось загрузить данные пользователя");
                console.error("Ошибка при загрузке данных пользователя", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className={styles.page}>
            <ToastContainer/>
            <h1 className={styles.title}>Оплата заказа</h1>

            <div className={styles.checkoutContainer}>
                {/* Левая часть: Корзина */}
                <div className={styles.cartSection}>
                    <h2>Корзина</h2>

                    {items.length === 0 ? (
                        <p className={styles.empty}>Ваша корзина пуста</p>
                    ) : (
                        <>
                            <ul className={styles.itemList}>
                                {items.map((item) => (
                                    <li key={item.id} className={styles.item}>
                                        <img src={item.imageUrl} alt={item.title} className={styles.image}/>
                                        <div className={styles.info}>
                                            <h3>{item.title}</h3>
                                            <p>{item.quantity} × {item.price} ₽</p>
                                            <p className={styles.itemTotal}>
                                                = {item.quantity * item.price} ₽
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <PromoCodeInput total={total} onApplyDiscount={handlePromo}/>

                            <div className={styles.summary}>
                                <p>Сумма заказа: {total} ₽</p>
                                <div className={styles.discount}>
                                    {discount > 0 ? (
                                        <>
                                            <p>Скидка:</p>
                                            <p style={{ color: "red" }}>-{discount} ₽</p>
                                        </>
                                    ) : null}
                                </div>
                                <BonusSelector available={user?.bonuses || 0} used={usedBonuses} maxToUse={total - discount} onChange={setUsedBonuses}/>
                                <p className={styles.total}>Итого к оплате: {finalTotal} ₽</p>
                                <button className={styles.payBtn} onClick={handlePay}>
                                    Оплатить
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Правая часть: Информация о пользователе и выбор адреса */}
                <div className={styles.userInfoSection}>
                    <h2>Информация о пользователе</h2>
                    <div className={styles.userInfo}>
                        <p><strong>Имя:</strong> {user?.firstName}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Телефон:</strong> {user?.phone}</p>
                    </div>

                    <h3>Адрес доставки:</h3>
                    {/* Отображаем выбранный адрес или сообщение о его отсутствии */}
                    <div className={styles.selectedAddressContainer}>
                        {selectedAddress ? (
                            <div className={styles.selectedAddress}>
                                <p>{selectedAddress.address}</p>
                                <p>Подъезд: {selectedAddress.entrance}</p>
                                <p>Этаж: {selectedAddress.floor} </p>
                                <p>Квартира: {selectedAddress.floor}</p>
                                <p>Комментарий: {selectedAddress.notes} </p>
                                <button
                                    className={styles.changeAddressBtn}
                                    onClick={() => setIsOpen(true)} // Открытие модального окна для выбора нового адреса
                                >
                                    Изменить
                                </button>
                            </div>
                        ) : (
                            <button
                                className={styles.selectAddressBtn}
                                onClick={() => setIsOpen(true)} // Открытие модального окна для выбора адреса
                            >
                                Выбрать адрес доставки
                            </button>
                        )}
                    </div>

                    {/* Модальное окно выбора адреса */}
                    <DeliveryAddressSelector setAddress={setSelectedAddress}  open={isOpen} onClose={() => setIsOpen(false)} />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
