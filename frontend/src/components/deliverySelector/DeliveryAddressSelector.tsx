import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Divider,
    Paper,
    Modal
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import AddressFormPopup from "../addressFormPopup/AddressFormPopup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addAddress, Address, deleteAddress, selectAddress } from "../../store/addressSlice";

declare global {
    interface Window {
        ymaps: any;
    }
}

const DeliveryAddressSelector: React.FC<{ open: boolean; onClose: () => void, setAddress: (address: Address) => void }> = ({ open, onClose, setAddress }) => {
    const dispatch = useDispatch();
    const addresses = useSelector((state: RootState) => state.address.list);
    const selected = useSelector((state: RootState) => state.address.selected);
    const [dialogOpen, setDialogOpen] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const placemark = useRef<any>(null);
    const mapWasInitialized = useRef(false);

    useEffect(() => {
        if (!open) return;

        const kremlinCoordinates = [55.7558, 37.6173]; // Координаты Кремля

        const loadMap = () => {
            if (!window.ymaps || !mapRef.current || mapWasInitialized.current) return;

            window.ymaps.ready(() => {
                if (mapRef.current && !mapInstance.current) {
                    const centerCoordinates = selected ? [selected.lat, selected.lng] : kremlinCoordinates;

                    mapInstance.current = new window.ymaps.Map(mapRef.current, {
                        center: centerCoordinates,
                        zoom: 16,
                        controls: []
                    });

                    if (selected) {
                        placemark.current = new window.ymaps.Placemark([selected.lat, selected.lng], {}, { draggable: false });
                        mapInstance.current.geoObjects.add(placemark.current);
                    }

                    mapWasInitialized.current = true;
                }
            });
        };

        if (!window.ymaps) {
            const script = document.createElement("script");
            script.src = `${process.env.REACT_APP_GEOCODER_URL}/?lang=ru_RU&apikey=${process.env.REACT_APP_GEOCODER_API_KEY}`;
            script.type = "text/javascript";
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, [selected, open]);

    // Перемещение камеры и маркера на новый адрес
    useEffect(() => {
        if (!window.ymaps || !mapInstance.current || !selected) return;

        const newCoords = [selected.lat, selected.lng];
        if (placemark.current) {
            placemark.current.geometry.setCoordinates(newCoords);
        } else {
            placemark.current = new window.ymaps.Placemark(newCoords, {}, { draggable: false });
            mapInstance.current.geoObjects.add(placemark.current);
        }

        mapInstance.current.setCenter(newCoords, 16, {
            checkZoomRange: true,
            duration: 500,
            timingFunction: "ease-in-out",
        });
    }, [selected]);

    const handleOrder = () => {
        if (selected) {
            setAddress(selected); // Передаем весь объект Address
            onClose();
        }
    };

    const handleAddAddress = (fullAddress: Address) => {
        if (!window.ymaps) {
            alert("Ошибка загрузки карты. Попробуйте позже.");
            return;
        }

        window.ymaps.geocode(fullAddress.address).then((res: any) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (!firstGeoObject) return;

            const coords = firstGeoObject.geometry.getCoordinates();
            const newEntry: Address = {
                address: fullAddress.address,
                floor: fullAddress.floor,
                entrance: fullAddress.entrance,
                apartmentNumber: fullAddress.apartmentNumber,
                intercomCode: fullAddress.intercomCode,
                notes: fullAddress.notes,
                lat: coords[0],
                lng: coords[1]
            };

            dispatch(addAddress(newEntry));
        }).catch((err: any) => {
            console.error("Ошибка геокодирования:", err);
            alert("Не удалось найти адрес.");
        });
    };

    const handleDeleteAddress = (address: Address) => {
        dispatch(deleteAddress(address)); // Передаем полный объект Address
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box height="80vh" width="80vw" position="absolute" top="10vh" left="10vw" bgcolor="#fff" borderRadius={2} boxShadow={4} overflow="hidden">
                <Box ref={mapRef} position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0} />

                <Paper elevation={3} sx={{ position: "absolute", top: 32, left: 32, zIndex: 10, width: 300, p: 3, borderRadius: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={1}>
                        <Typography variant="h6">Мои адреса</Typography>
                        <Button onClick={() => setDialogOpen(true)} startIcon={<Add />} size="small" variant="outlined">Новый адрес</Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {addresses.length === 0 && (
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Пока нет ни одного адреса. Добавьте новый, чтобы продолжить.
                        </Typography>
                    )}

                    <RadioGroup
                        value={selected?.address || ""}
                        onChange={(e) => {
                            const selectedAddress = addresses.find(addr => addr.address === e.target.value);
                            if (selectedAddress) {
                                dispatch(selectAddress(selectedAddress)); // Передаем полный объект Address
                            }
                        }}
                    >
                        {addresses.map((addr) => (
                            <Box key={addr.address} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <FormControlLabel value={addr.address} control={<Radio />} label={addr.address} />
                                <Box>
                                    <IconButton size="small" onClick={() => handleDeleteAddress(addr)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </RadioGroup>

                    <Button variant="contained" color="warning" fullWidth sx={{ mt: 3 }} disabled={!selected} onClick={handleOrder}>
                        Заказать сюда
                    </Button>
                </Paper>

                <AddressFormPopup open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleAddAddress} />
            </Box>
        </Modal>
    );
};

export default DeliveryAddressSelector;
