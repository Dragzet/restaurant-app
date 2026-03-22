export interface OrderItemResponse {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

export interface DeliveryResponse {
    address: string;
    floor: number;
    apartmentNumber: number;
    intercomCode: string;
    notes: string;
    status: string;
}

export interface OrderResponse {
    id: number;
    createdAt: string;
    totalPrice: number;
    usedBonuses: number;
    finalPrice: number;
    status: string;
    items: OrderItemResponse[];
    delivery: DeliveryResponse;
}

export interface OrderStatusUpdate {
    id: number;
    status: string;
    delivery: string;
}
