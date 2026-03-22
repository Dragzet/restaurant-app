import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const AdminHomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
            <Typography variant="h3" gutterBottom style={{ color: '#000' }}>
                Админ-панель
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 5 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/admin/menu')}
                    sx={{
                        backgroundColor: '#000',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#333' },
                        padding: '12px',
                        fontSize: '18px',
                    }}
                >
                    Редактирование меню
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/admin/booking')}
                    sx={{
                        backgroundColor: '#000',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#333' },
                        padding: '12px',
                        fontSize: '18px',
                    }}
                >
                    Заявки на брони
                </Button>
            </Box>
        </Container>
    );
};

export default AdminHomePage;
