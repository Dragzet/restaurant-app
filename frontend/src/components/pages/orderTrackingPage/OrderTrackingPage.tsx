import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Stack,
    Tabs,
    Tab,
    Fade,
} from "@mui/material";
import { toast } from "react-toastify";
import OrderService from "../../../api/services/orderService";
import { OrderResponse } from "../../../api/models/response/orderResponse";
import DeliveryStatusStepper from "../../deliveryStatusStepper/DeliveryStatusStepper";
import useOrderStatusPolling from "../../../api/polling/polling";

const OrderTrackingPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    const isActiveOrder = (status: string) =>
        status === "pending" || status === "preparing" || status === "on the way";

    const isHistoryOrder = (status: string) =>
        status === "delivered" || status === "canceled";


    useOrderStatusPolling((updatedStatuses) => {
        console.log("Получены обновления:", updatedStatuses);

        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                const update = updatedStatuses.find(
                    (u) => String(u.id) === String(order.id)
                );
                if (!update) return order;

                return {
                    ...order,
                    status: update.status ?? order.status,
                    delivery: {
                        ...order.delivery,
                        status: update.delivery ?? order.delivery.status,
                    },
                };
            })
        );
    });




    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await OrderService.getMyOrders();
                setOrders(response.data);
            } catch (error) {
                toast.error("Не удалось загрузить заказы");
                console.error("Ошибка при получении заказов", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const displayedOrders =
        tab === 0
            ? orders.filter((o) => isActiveOrder(o.status))
            : orders.filter((o) => isHistoryOrder(o.status));

    return (
        <Box sx={{ p: 4, maxWidth: "800px", mx: "auto", bgcolor: "white", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
                Мои заказы
            </Typography>

            <Tabs
                value={tab}
                onChange={(_, newTab) => setTab(newTab)}
                sx={{
                    mb: 3,
                    "& .MuiTab-root": {
                        fontSize: "1rem",
                        color: "black",
                    },
                    "& .Mui-selected": {
                        color: "black",
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#1976d2",
                    },
                }}
            >
                <Tab label="Активные" />
                <Tab label="История" />
            </Tabs>

            {loading ? (
                <Typography color="#ccc">Загрузка заказов...</Typography>
            ) : displayedOrders.length === 0 ? (
                <Typography color="#888">Нет заказов</Typography>
            ) : (
                <Stack spacing={3}>
                    {displayedOrders.map((order) => (
                        <Fade in timeout={400} key={order.id}>
                            <Card
                                elevation={3}
                                sx={{
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: "1.2rem" }}>
                                        Заказ №{order.id} —{" "}
                                        {new Date(order.createdAt).toLocaleString()}
                                    </Typography>

                                    <Typography variant="body1">
                                        Сумма: {order.totalPrice} ₽
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "#1976d2" }}>
                                        Использовано бонусов: {order.usedBonuses} ₽
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: "bold", color: "#4caf50" }}
                                    >
                                        Итого к оплате: {order.finalPrice} ₽
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle1" gutterBottom>
                                        Состав заказа:
                                    </Typography>
                                    <List dense>
                                        {order.items.map((item) => (
                                            <ListItem key={item.id} sx={{ pl: 0 }}>
                                                <ListItemText
                                                    primaryTypographyProps={{ fontSize: "1rem" }}
                                                    primary={`${item.name} × ${item.quantity}`}
                                                    secondary={`${item.price} ₽ за шт. — ${item.total} ₽`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle1" gutterBottom>
                                        Доставка:
                                    </Typography>
                                    <Typography variant="body2">
                                        {order.delivery.address}, этаж: {order.delivery.floor}, кв:{" "}
                                        {order.delivery.apartmentNumber}
                                    </Typography>
                                    <Typography variant="body2">
                                        Подъезд: {order.delivery.intercomCode}
                                    </Typography>
                                    {order.delivery.notes && (
                                        <Typography variant="body2" color="text.secondary">
                                            Комментарий: {order.delivery.notes}
                                        </Typography>
                                    )}

                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Статус доставки:
                                        </Typography>
                                        <DeliveryStatusStepper status={order.delivery.status} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default OrderTrackingPage;
