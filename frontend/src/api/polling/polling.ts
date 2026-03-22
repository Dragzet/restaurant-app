import { useEffect, useRef } from "react";
import { AxiosError } from "axios";
import { OrderStatusUpdate } from "../models/response/orderResponse";
import OrderService from "../services/orderService";

const useOrderStatusPolling = (
    onUpdate: (updates: OrderStatusUpdate[]) => void,
    intervalMs: number = 5000
) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const onUpdateRef = useRef(onUpdate);

    useEffect(() => {
        onUpdateRef.current = onUpdate;
    }, [onUpdate]);

    useEffect(() => {
        let isCancelled = false;

        const poll = async () => {
            try {
                const res = await OrderService.getStatuses();
                if (!isCancelled) {
                    onUpdateRef.current(res.data);
                }
            } catch (err: unknown) {
                const error = err as AxiosError;
                if (error.response?.status !== 404) {
                    console.error("Polling error:", error);
                }
            } finally {
                if (!isCancelled) {
                    timeoutRef.current = setTimeout(poll, intervalMs);
                }
            }
        };

        poll();

        return () => {
            isCancelled = true;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [intervalMs]);
};

export default useOrderStatusPolling;
