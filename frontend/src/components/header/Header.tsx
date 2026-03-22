import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import {
    FaUserShield,
    FaSignOutAlt,
    FaUser as UserIconRaw,
    FaShoppingCart as OrdersIconRaw,
    FaGift as GiftsIconRaw,
    FaCalendarCheck as BookingIconRaw,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../../store/store";
import {logout} from "../../store/authSlice";

const UserIcon = UserIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const OrdersIcon = OrdersIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const GiftIcon = GiftsIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BookingIcon = BookingIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const AdminIcon = FaUserShield as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const LogoutIcon = FaSignOutAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.auth);

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img src={logo} alt="Логотип" className={styles.logo} onClick={() => navigate("/")}/>
                <h2 style={{cursor: "pointer"}} onClick={() => navigate("/")}>Ресторан Чипсы</h2>
            </div>

            <div className={styles.right}>
                {user?.isAdmin && (
                    <div className={styles.profile} onClick={() => navigate("/admin")}>
                        <AdminIcon className={styles.icon}/>
                        <p>Админ</p>
                    </div>
                )}
                <div className={styles.profile} onClick={() => navigate("/profile")}>
                    <UserIcon className={styles.icon}/>
                    <p>Профиль</p>
                </div>
                <div className={styles.profile} onClick={() => navigate("/orders")}>
                    <OrdersIcon className={styles.icon}/>
                    <p>Заказы</p>
                </div>
                <div className={styles.profile} onClick={() => navigate("/gift")}>
                    <GiftIcon className={styles.icon}/>
                    <p>Сертификаты</p>
                </div>
                <div className={styles.profile} onClick={() => navigate("/booking")}>
                    <BookingIcon className={styles.icon}/>
                    <p>Букинг</p>
                </div>
                <div className={styles.profile} onClick={() => {
                    dispatch(logout());
                    navigate("/login");
                }}>
                    <LogoutIcon className={styles.icon}/>
                    <p>Выход</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
