import api from "../api";
import { ReservationRequest } from "../models/request/reservationRequest";
import { Reservation } from "../models/dto/reservation";
import { EventRequest } from "../models/request/eventRequest";
import { Event } from "../models/dto/event";
import { AxiosResponse } from "axios";

export default class ReservationEventService {
    static async createReservation(request: ReservationRequest): Promise<AxiosResponse<Reservation>> {
        return api.post<Reservation>('/api/v1/reservations', request);
    }

    static async createEvent(request: EventRequest): Promise<AxiosResponse<Event>> {
        return api.post<Event>('/api/v1/events', request);
    }

    static async getMyReservations(): Promise<AxiosResponse<Reservation[]>> {
        return api.get<Reservation[]>('/api/v1/reservations/me');
    }

    static async getMyEvents(): Promise<AxiosResponse<Event[]>> {
        return api.get<Event[]>('/api/v1/events/me');
    }

    static async getAllReservations(): Promise<AxiosResponse<Reservation[]>> {
        return api.get<Reservation[]>('/api/v1/reservations');
    }

    static async getAllEvents(): Promise<AxiosResponse<Event[]>> {
        return api.get<Event[]>('/api/v1/events');
    }

    static async updateReservationStatus(id: number, status: string, comment: string): Promise<AxiosResponse<void>> {
        return api.patch<void>(`/api/v1/reservations/${id}/status`, { status,  comment  });
    }

    static async updateEventStatus(id: number, status: string, comment: string): Promise<AxiosResponse<void>> {
        return api.patch<void>(`/api/v1/events/${id}/status`, { status, comment });
    }
}
