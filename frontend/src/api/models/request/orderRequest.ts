export interface OrderItemsRequest {
    id: number;
    quantity: number;
}

export interface OrderAddress {
    address: string;
    floor: number;
    apartmentNumber: number;
    intercomCode: string;
    notes: string;
}

export interface OrderRequest {
    orderItems: OrderItemsRequest[];
    orderAddress: OrderAddress;
    code: string;
    usedBonuses: number;
}
