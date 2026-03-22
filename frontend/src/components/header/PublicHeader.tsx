import styles from "./PublicHeader.module.css";
import logo from "../../assets/logo.png";
import {
    FaSignInAlt as LoginIconRaw,
    FaUserPlus as SignupIconRaw,
    FaUtensils as MenuIconRaw,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import React from "react";

const LoginIcon = LoginIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const SignupIcon = SignupIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const MenuIcon = MenuIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const PublicHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img src={logo} alt="Логотип" className={styles.logo} onClick={() => navigate("/")}/>
                <h2 style={{cursor: "pointer"}} onClick={() => navigate("/")}>Ресторан Чипсы</h2>
            </div>

            <div className={styles.right}>
                <div className={styles.profile} onClick={() => navigate("/menu")}>
                    <MenuIcon className={styles.icon}/>
                    <p>Меню</p>
                </div>
                <div className={styles.profile} onClick={() => navigate("/login")}>
                    <LoginIcon className={styles.icon}/>
                    <p>Вход</p>
                </div>
                <div className={styles.profile} onClick={() => navigate("/signup")}>
                    <SignupIcon className={styles.icon}/>
                    <p>Регистрация</p>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;

