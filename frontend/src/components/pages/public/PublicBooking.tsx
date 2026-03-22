import React, { useState } from 'react';
import {
    Container, Typography, TextField, Button, Grid, Paper, Box
} from '@mui/material';
import { ReservationRequest } from "../../../api/models/request/reservationRequest";
import ReservationEventService from "../../../api/services/reservationEventService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PublicBooking: React.FC = () => {
    const [reservationForm, setReservationForm] = useState<ReservationRequest>({ date: '', time: '', guests: 1 });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const navigate = useNavigate();

    const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReservationForm((prev: ReservationRequest) => ({
            ...prev,
            [name]: name === 'guests' ? parseInt(value) : value
        }));
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: typeof formData) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateReservation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error("Пожалуйста, заполните все поля");
            return;
        }

        if (!reservationForm.date || !reservationForm.time || reservationForm.guests < 1) {
            toast.error("Пожалуйста, заполните дату, время и количество гостей");
            return;
        }

        setLoading(true);
        try {
            const reservationData = {
                ...reservationForm,
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            };
            await ReservationEventService.createReservation(reservationData);
            toast.success("Заявка на бронь успешно создана! Мы свяжемся с вами по указанному телефону");
            setReservationForm({ date: '', time: '', guests: 1 });
            setFormData({ name: '', email: '', phone: '' });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Ошибка создания брони");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{ color: "#000" }}
                >
                    Назад
                </Button>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                    Бронирование столика
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                    Заполните форму ниже, чтобы забронировать столик. Мы свяжемся с вами для подтверждения.
                </Typography>

                <Box component="form" onSubmit={handleCreateReservation} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Контактная информация */}
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Ваши контакты
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Имя"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    placeholder="Иван Иванов"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    placeholder="example@mail.com"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Телефон"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    placeholder="+7 (999) 999-99-99"
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Параметры бронирования */}
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Параметры бронирования
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Дата"
                                    name="date"
                                    type="date"
                                    value={reservationForm.date}
                                    onChange={handleReservationChange}
                                    fullWidth
                                    required
                                    inputProps={{
                                        min: dayjs().format('YYYY-MM-DD')
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Время"
                                    name="time"
                                    type="time"
                                    value={reservationForm.time}
                                    onChange={handleReservationChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Количество гостей"
                                    name="guests"
                                    type="number"
                                    value={reservationForm.guests}
                                    onChange={handleReservationChange}
                                    fullWidth
                                    required
                                    inputProps={{
                                        min: 1,
                                        max: 20
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#000',
                            color: '#fff',
                            py: 1.5,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#333'
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc'
                            }
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} sx={{ color: '#fff' }} />
                                Отправка...
                            </Box>
                        ) : (
                            "Забронировать столик"
                        )}
                    </Button>
                </Box>
            </Paper>

            <ToastContainer />
        </Container>
    );
};

export default PublicBooking;


