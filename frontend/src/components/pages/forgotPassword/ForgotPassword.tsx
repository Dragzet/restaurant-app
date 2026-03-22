import React, { useState, useEffect } from "react";
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
import AuthService from "../../../api/services/authService";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [timer, setTimer] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        sendResetEmail();
    };

    const sendResetEmail = async () => {
        setLoading(true);
        try {
            await AuthService.sendPasswordResetEmail(email);
            setSuccess(true);
            setTimer(60); // запускаем таймер на 60 секунд
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Ошибка отправки письма");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    return (
        <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 6, backgroundColor: '#fff', textAlign: 'center', borderRadius: 2, width: '500px' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Восстановление пароля
                </Typography>
                {success ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Если email существует, на него отправлено письмо для сброса пароля. Проверьте почту.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#000', color: '#fff' }}
                            onClick={sendResetEmail}
                            disabled={timer > 0}
                        >
                            {timer > 0 ? `Отправить ещё раз через ${timer} сек` : "Отправить ещё раз"}
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            {loading ? "Отправка..." : "Отправить ссылку"}
                        </Button>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Вспомнили пароль?{" "}
                            <Link href="/login" underline="hover" sx={{ fontWeight: 'bold', color: '#000' }}>
                                Войти
                            </Link>
                        </Typography>
                    </Box>
                )}
            </Paper>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </Container>
    );
};

export default ForgotPassword;
