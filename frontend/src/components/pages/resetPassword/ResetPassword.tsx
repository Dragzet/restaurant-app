import React, { useState } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Paper,
    Link,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import AuthService from "../../../api/services/authService";

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Токен отсутствует в ссылке");
            return;
        }

        setLoading(true);
        try {
            await AuthService.resetPassword(token, newPassword);
            setSuccess(true);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Ошибка сброса пароля");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 6, backgroundColor: '#fff', textAlign: 'center', borderRadius: 2, width: '500px' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Сброс пароля
                </Typography>
                {success ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Пароль успешно изменён!{" "}
                        <Link href="/login" underline="hover" sx={{ fontWeight: 'bold', color: '#000' }}>
                            Войти
                        </Link>
                    </Typography>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                        <TextField
                            label="Новый пароль"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ backgroundColor: '#000', color: '#fff', mt: 2 }}
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? "Отправка..." : "Сбросить пароль"}
                        </Button>
                    </Box>
                )}
            </Paper>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </Container>
    );
};

export default ResetPassword;
