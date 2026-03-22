import React, { useState } from "react";
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

const DeliveryAddressSelector: React.FC<{ open: boolean; onClose: () => void, setAddress: (address: Address) => void }> = ({ open, onClose, setAddress }) => {
    const dispatch = useDispatch();
    const addresses = useSelector((state: RootState) => state.address.list);
    const selected = useSelector((state: RootState) => state.address.selected);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOrder = () => {
        if (selected) {
            setAddress(selected);
            onClose();
        }
    };

    const handleAddAddress = (fullAddress: Address) => {
        const newEntry: Address = {
            address: fullAddress.address,
            floor: fullAddress.floor,
            entrance: fullAddress.entrance,
            apartmentNumber: fullAddress.apartmentNumber,
            intercomCode: fullAddress.intercomCode,
            notes: fullAddress.notes,
            lat: fullAddress.lat || 55.7558,
            lng: fullAddress.lng || 37.6173
        };

        dispatch(addAddress(newEntry));
    };

    const handleDeleteAddress = (address: Address) => {
        dispatch(deleteAddress(address));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box height="auto" width="90vw" maxWidth="500px" position="absolute" top="50%" left="50%" sx={{ transform: 'translate(-50%, -50%)' }} bgcolor="#fff" borderRadius={2} boxShadow={4} p={3} overflow="auto">
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
                                dispatch(selectAddress(selectedAddress));
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
