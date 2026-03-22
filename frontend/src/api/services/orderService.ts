import {OrderRequest} from "../models/request/orderRequest";
import {AxiosResponse} from "axios";
import api from "../api";
import {OrderResponse, OrderStatusUpdate} from "../models/response/orderResponse";

export default class OrderService {
    static async create(request: OrderRequest): Promise<AxiosResponse<any>> {
        return api.post<AxiosResponse<any>>(`/api/v1/orders`, request)
    }
    static async getMyOrders(): Promise<AxiosResponse<OrderResponse[]>> {
        return api.get<OrderResponse[]>("/api/v1/orders/mine");
    }
    static async getStatuses(): Promise<AxiosResponse<OrderStatusUpdate[]>> {
        return api.get("/api/v1/orders/status");
    }
}