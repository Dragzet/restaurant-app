import React from "react";
import styles from "./CustomToast.module.css";

interface CustomToastProps {
    title: string;
    description: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ title, description }) => {
    return (
        <div className={styles.customToast}>
            <div className={styles.customToastTitle}>{title}</div>
            <div className={styles.customToastDesc}>{description}</div>
        </div>
    );
};

export default CustomToast;
