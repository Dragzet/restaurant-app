export interface Reservation {
    id: number;
    userId?: number; // опционально для гостевых бронирований
    date: string;
    time: string;
    guests: number;
    status: string;
    createdAt: string;
    // Поля для гостевых бронирований
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
}
