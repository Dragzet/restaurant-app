import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { Reservation } from '../../../api/models/dto/reservation';
import { ReservationRequest } from "../../../api/models/request/reservationRequest";
import { EventRequest } from "../../../api/models/request/eventRequest";
import ReservationEventService from "../../../api/services/reservationEventService";
import { Event } from '../../../api/models/dto/event';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import {
    FaCheckCircle as CheckIconRaw,
    FaTimesCircle as CancelIconRaw
} from 'react-icons/fa';

const CheckIcon = CheckIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const CancelIcon = CancelIconRaw as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const BookingPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [reservationForm, setReservationForm] = useState<ReservationRequest>({ date: '', time: '', guests: 1 });
    const [eventForm, setEventForm] = useState<EventRequest>({ date: '', startTime: '', duration: 60, guests: 1, type: '', price: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await ReservationEventService.getMyReservations();
            const ev = await ReservationEventService.getMyEvents();
            setReservations(res.data);
            setEvents(ev.data);
        } catch (error) {
            toast.error("Ошибка загрузки данных");
        }
    };

    const handleCreateReservation = async () => {
        try {
            await ReservationEventService.createReservation(reservationForm);
            toast.success("Бронь успешно создана");
            loadData();
        } catch (error) {
            toast.error("Ошибка создания брони");
        }
    };

    const handleCreateEvent = async () => {
        try {
            await ReservationEventService.createEvent(eventForm);
            toast.success("Мероприятие успешно создано");
            loadData();
        } catch (error) {
            toast.error("Ошибка создания мероприятия");
        }
    };

    const renderStatusIcon = (status: string): React.ReactElement => {
        if (status.toLowerCase().includes('confirmed')) {
            return <CheckIcon style={{ fontSize: 20, fill: 'green' }} />;
        }
        if (status.toLowerCase().includes('canceled') || status.toLowerCase().includes('rejected')) {
            return <CancelIcon style={{ fontSize: 20, fill: 'red' }} />;
        }
        return <CircularProgress size={20} color="info" />;
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <Typography variant="h4" gutterBottom>Бронирования</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Новая бронь столика</Typography>
                    <TextField label="Дата" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={reservationForm.date} onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })} />
                    <TextField label="Время" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={reservationForm.time} onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })} />
                    <TextField label="Гостей" type="number" fullWidth margin="normal" value={reservationForm.guests} onChange={(e) => setReservationForm({ ...reservationForm, guests: +e.target.value })} />
                    <Button variant="contained" onClick={handleCreateReservation}>Создать бронь</Button>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Новое мероприятие</Typography>
                    <TextField label="Дата" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
                    <TextField label="Время начала" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={eventForm.startTime} onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })} />
                    <TextField label="Длительность (мин)" type="number" fullWidth margin="normal" value={eventForm.duration} onChange={(e) => setEventForm({ ...eventForm, duration: +e.target.value })} />
                    <TextField label="Гостей" type="number" fullWidth margin="normal" value={eventForm.guests} onChange={(e) => setEventForm({ ...eventForm, guests: +e.target.value })} />
                    <TextField label="Тип" fullWidth margin="normal" value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} />
                    <Button variant="contained" onClick={handleCreateEvent}>Создать мероприятие</Button>
                </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>Текущие брони</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Время</TableCell>
                        <TableCell>Гостей</TableCell>
                        <TableCell>Статус</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{dayjs(r.date).format('DD.MM.YYYY')}</TableCell>
                            <TableCell>{dayjs(r.time).format('HH:mm:ss')}</TableCell>
                            <TableCell>{r.guests}</TableCell>
                            <TableCell>{renderStatusIcon(r.status)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>Текущие мероприятия</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Время начала</TableCell>
                        <TableCell>Длительность</TableCell>
                        <TableCell>Гостей</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Статус</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell>{dayjs(e.date).format('DD.MM.YYYY')}</TableCell>
                            <TableCell>{dayjs(e.startTime).format('HH:mm:ss')}</TableCell>
                            <TableCell>{e.duration}</TableCell>
                            <TableCell>{e.guests}</TableCell>
                            <TableCell>{e.type}</TableCell>
                            <TableCell>{renderStatusIcon(e.status)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default BookingPage;
