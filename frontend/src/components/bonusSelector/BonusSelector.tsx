import React from "react";
import styles from "./BonusSelector.module.css";

interface BonusSelectorProps {
    available: number;
    used: number;
    maxToUse: number;
    onChange: (value: number) => void;
}

const BonusSelector: React.FC<BonusSelectorProps> = ({ available, used, maxToUse, onChange }) => {
    const canUse = Math.min(available, maxToUse);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Бонусы</h3>
            <div className={styles.options}>
                <button
                    className={`${styles.option} ${used === 0 ? styles.active : ""}`}
                    onClick={() => onChange(0)}
                >
                    Не списывать
                </button>
                <button
                    className={`${styles.option} ${used > 0 ? styles.active : ""}`}
                    onClick={() => onChange(canUse)}
                    disabled={canUse === 0}
                >
                    Списать <span className={styles.plus}>⨁</span> {canUse}
                </button>
            </div>
        </div>
    );
};

export default BonusSelector;
