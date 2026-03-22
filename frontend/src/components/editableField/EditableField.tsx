import React, { useState, useEffect } from "react";
import styles from "./EditableField.module.css";

interface EditableFieldProps {
    label: string;
    value: string;
    onSave: (val: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        if (!isEditing) {
            setTempValue(value);
        }
    }, [value, isEditing]);

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.label}>{label}</div>
            <div className={styles.inputWrapper}>
                <input
                    className={styles.input}
                    value={tempValue}
                    disabled={!isEditing}
                    onChange={(e) => setTempValue(e.target.value)}
                />
                {isEditing ? (
                    <>
                        <button className={styles.saveBtn} onClick={handleSave}>
                            Сохранить
                        </button>
                        <button className={styles.cancelBtn} onClick={handleCancel}>
                            Отменить
                        </button>
                    </>
                ) : (
                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                        Изменить
                    </button>
                )}
            </div>
        </div>
    );
};

export default EditableField;