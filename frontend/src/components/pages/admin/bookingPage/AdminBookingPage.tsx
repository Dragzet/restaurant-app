import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Reservation } from '../../../../api/models/dto/reservation';
import { Event } from '../../../../api/models/dto/event';
import reservationEventService from '../../../../api/services/reservationEventService';
import userService from '../../../../api/services/userService';
import { User } from '../../../../api/models/dto/user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const statusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'confirmed':
            return 'success';
        case 'canceled':
        case 'rejected':
            return 'error';
        default:
            return 'default';
    }
};

const statusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'В ожидании';
        case 'confirmed':
            return 'Подтверждено';
        case 'canceled':
            return 'Отменено';
        case 'rejected':
            return 'Отклонено';
        default:
            return 'Неизвестно';
    }
};

const AdminBookingPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [users, setUsers] = useState<{ [key: number]: User }>({});

    const [comment, setComment] = useState('');
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [commentEvent, setCommentEvent] = useState('');
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await reservationEventService.getAllReservations();
            const ev = await reservationEventService.getAllEvents();

            const sortedReservations = res.data.sort((a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
            );

            const sortedEvents = ev.data.sort((a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
            );

            setReservations(sortedReservations);
            setEvents(sortedEvents);

            const userIds = Array.from(new Set([
                ...res.data.map((r) => r.userId),
                ...ev.data.map((e) => e.userId)
            ]));

            const usersMap: { [key: number]: User } = {};

            await Promise.all(
                userIds.map(async (id) => {
                    try {
                        const response = await userService.getUserById(id);
                        usersMap[id] = response.data;
                    } catch {
                        toast.error(`Ошибка загрузки данных пользователя ${id}`);
                    }
                })
            );

            setUsers(usersMap);
        } catch (error) {
            toast.error("Ошибка загрузки данных");
        }
    };

    const handleUpdateReservationStatus = async (id: number, status: string, commentText = '') => {
        try {
            await reservationEventService.updateReservationStatus(id, status, commentText);
            toast.success("Статус обновлён");
            loadData();
        } catch (error) {
            toast.error("Ошибка обновления статуса");
        }
    };

    const handleUpdateEventStatus = async (id: number, status: string, commentText = '') => {
        try {
            await reservationEventService.updateEventStatus(id, status, commentText);
            toast.success("Статус мероприятия обновлён");
            loadData();
        } catch (error) {
            toast.error("Ошибка обновления статуса мероприятия");
        }
    };

    const openCommentDialog = (id: number) => {
        setSelectedReservationId(id);
        setComment('');
        setDialogOpen(true);
    };

    const handleCommentSubmit = async () => {
        if (selectedReservationId !== null) {
            await handleUpdateReservationStatus(selectedReservationId, 'canceled', comment);
            setDialogOpen(false);
        }
    };

    const openEventCommentDialog = (id: number) => {
        setSelectedEventId(id);
        setCommentEvent('');
        setEventDialogOpen(true);
    };

    const handleEventCommentSubmit = async () => {
        if (selectedEventId !== null) {
            await handleUpdateEventStatus(selectedEventId, 'rejected', commentEvent);
            setEventDialogOpen(false);
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <Typography variant="h4" gutterBottom>Администрирование заявок</Typography>

            <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>Брони столиков</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Время</TableCell>
                        <TableCell>Гостей</TableCell>
                        <TableCell>Пользователь</TableCell>
                        <TableCell>Почта пользователя</TableCell>
                        <TableCell>Дата создания</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{dayjs(r.date).format('DD.MM.YYYY')}</TableCell>
                            <TableCell>{dayjs(r.time).format('HH:mm')}</TableCell>
                            <TableCell>{r.guests}</TableCell>
                            <TableCell>{users[r.userId]?.firstName + " " + users[r.userId]?.lastName || 'Загрузка...'}</TableCell>
                            <TableCell>{users[r.userId]?.email || 'Загрузка...'}</TableCell>
                            <TableCell>{dayjs(r.createdAt).format('DD.MM.YYYY HH:mm')}</TableCell>
                            <TableCell>
                                <Chip label={statusText(r.status)} color={statusColor(r.status)} />
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                                    <Button variant="contained" color="success" size="small"
                                            onClick={() => handleUpdateReservationStatus(r.id, 'confirmed')}
                                            disabled={r.status !== 'pending'}>
                                        Подтвердить
                                    </Button>
                                    <Button variant="contained" color="error" size="small"
                                            onClick={() => openCommentDialog(r.id)}
                                            disabled={r.status !== 'pending'}>
                                        Отклонить
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>Мероприятия</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Время начала</TableCell>
                        <TableCell>Длительность</TableCell>
                        <TableCell>Гостей</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Пользователь</TableCell>
                        <TableCell>Почта пользователя</TableCell>
                        <TableCell>Дата создания</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell>{dayjs(e.date).format('DD.MM.YYYY')}</TableCell>
                            <TableCell>{dayjs(e.startTime).format('HH:mm')}</TableCell>
                            <TableCell>{e.duration}</TableCell>
                            <TableCell>{e.guests}</TableCell>
                            <TableCell>{e.type}</TableCell>
                            <TableCell>{users[e.userId]?.firstName + " " + users[e.userId]?.lastName || 'Загрузка...'}</TableCell>
                            <TableCell>{users[e.userId]?.email || 'Загрузка...'}</TableCell>
                            <TableCell>{dayjs(e.createdAt).format('DD.MM.YYYY HH:mm')}</TableCell>
                            <TableCell>
                                <Chip label={statusText(e.status)} color={statusColor(e.status)} />
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                                    <Button variant="contained" color="success" size="small"
                                            onClick={() => handleUpdateEventStatus(e.id, 'confirmed')}
                                            disabled={e.status !== 'pending'}>
                                        Подтвердить
                                    </Button>
                                    <Button variant="contained" color="error" size="small"
                                            onClick={() => openEventCommentDialog(e.id)}
                                            disabled={e.status !== 'pending'}>
                                        Отклонить
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Модалка для брони */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Причина отклонения брони</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Комментарий"
                        type="text"
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleCommentSubmit} variant="contained" color="error">Отправить</Button>
                </DialogActions>
            </Dialog>

            {/* Модалка для мероприятий */}
            <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)}>
                <DialogTitle>Причина отклонения мероприятия</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Комментарий"
                        type="text"
                        fullWidth
                        value={commentEvent}
                        onChange={(e) => setCommentEvent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEventDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleEventCommentSubmit} variant="contained" color="error">Отправить</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminBookingPage;
