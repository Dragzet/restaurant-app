import React from 'react';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const GuestHome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 8, textAlign: 'center' }}>
                {/* Заголовок с логотипом */}
                <Box sx={{ mb: 6 }}>
                    <img 
                        src="/logo.png" 
                        alt="Логотип" 
                        style={{ height: '80px', marginBottom: '16px' }}
                    />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Ресторан Чипсы
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
                        Добро пожаловать! Просмотрите наше меню или забронируйте столик.
                    </Typography>
                </Box>

                {/* Основные действия для гостей */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} sm={6}>
                        <Paper 
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6
                                }
                            }}
                            onClick={() => navigate('/menu')}
                        >
                            <RestaurantMenuIcon sx={{ fontSize: 48, marginBottom: '16px', color: '#000' }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Просмотр меню
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                Ознакомьтесь с нашими блюдами и ценами
                            </Typography>
                            <Button 
                                variant="contained"
                                sx={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#333' }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/menu');
                                }}
                            >
                                Открыть меню
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper 
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6
                                }
                            }}
                            onClick={() => navigate('/booking')}
                        >
                            <EventNoteIcon sx={{ fontSize: 48, marginBottom: '16px', color: '#000' }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Бронирование столика
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                Забронируйте столик на удобное время
                            </Typography>
                            <Button 
                                variant="contained"
                                sx={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#333' }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/booking');
                                }}
                            >
                                Забронировать
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Регистрация и вход */}
                <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
                    Уже зарегистрированы?
                </Typography>
                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    <Grid item xs={12} sm={4}>
                        <Button 
                            variant="contained"
                            fullWidth
                            startIcon={<LoginIcon />}
                            onClick={() => navigate('/login')}
                            sx={{
                                backgroundColor: '#000',
                                color: '#fff',
                                py: 1.5,
                                fontSize: '16px',
                                '&:hover': { backgroundColor: '#333' }
                            }}
                        >
                            Вход
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button 
                            variant="outlined"
                            fullWidth
                            startIcon={<PersonAddIcon />}
                            onClick={() => navigate('/signup')}
                            sx={{
                                borderColor: '#000',
                                color: '#000',
                                py: 1.5,
                                fontSize: '16px',
                                '&:hover': { 
                                    borderColor: '#333',
                                    color: '#333'
                                }
                            }}
                        >
                            Регистрация
                        </Button>
                    </Grid>
                </Grid>

                {/* Информация */}
                <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                        После регистрации вы сможете отслеживать заказы, управлять бронированиями и получать специальные предложения.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default GuestHome;


