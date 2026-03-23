# 🌐 Фронтенд

## Технологический стек

| Технология | Версия | Назначение |
|-----------|--------|------------|
| React | 18.3.1 | UI-фреймворк |
| TypeScript | 4.x | Типизация |
| Redux Toolkit | последняя | Управление состоянием |
| Material-UI (MUI) | v5 | UI-компоненты |
| React Router | v7 | Маршрутизация |
| Axios | последняя | HTTP-клиент |
| React Hook Form | последняя | Управление формами |
| Framer Motion | последняя | Анимации |
| Day.js | последняя | Работа с датами |

---

## 📁 Структура проекта

```
frontend/src/
├── App.tsx                          # Корневой компонент
├── index.tsx                        # Точка входа React DOM
│
├── components/
│   ├── router/
│   │   └── AppRouter.tsx            # Маршрутизатор (публичные/приватные/admin)
│   │
│   ├── pages/
│   │   ├── admin/                   # Административные страницы
│   │   │   ├── AdminPage.tsx        # Дашборд администратора
│   │   │   ├── AdminMenuPage.tsx    # Управление меню
│   │   │   └── AdminBookingPage.tsx # Управление бронированиями
│   │   ├── login/                   # Страница входа
│   │   ├── signup/                  # Страница регистрации
│   │   ├── main/                    # Главная страница (с меню)
│   │   ├── checkoutPage/            # Оформление заказа
│   │   ├── bookingPage/             # Бронирование столика
│   │   ├── orderTrackingPage/       # Отслеживание заказов
│   │   ├── giftCardPage/            # Подарочные сертификаты
│   │   └── public*/                 # Публичные страницы
│   │
│   ├── header/
│   │   ├── Header.tsx               # Заголовок для авторизованных пользователей
│   │   └── PublicHeader.tsx         # Заголовок для гостей
│   │
│   ├── productCard/                 # Карточка блюда в меню
│   ├── cartItemCard/                # Элемент корзины
│   ├── categoryNav/                 # Навигация по категориям меню
│   ├── sideCart/                    # Боковая корзина
│   └── ui/                          # MUI тема, переиспользуемые компоненты
│
├── api/
│   ├── api.ts                       # Axios клиент с JWT interceptors
│   ├── services/                    # API-сервисы
│   │   ├── authService.ts           # Аутентификация
│   │   ├── userService.ts           # Пользователь
│   │   ├── categoryService.ts       # Категории
│   │   ├── menuService.ts           # Меню
│   │   ├── orderService.ts          # Заказы
│   │   ├── reservationEventService.ts # Бронирования и мероприятия
│   │   └── giftCertificateService.ts  # Сертификаты
│   ├── models/
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── request/                 # Модели запросов
│   │   └── response/                # Модели ответов
│   └── polling/                     # Polling для отслеживания заказов
│
└── store/
    ├── store.ts                     # Redux Store
    ├── authSlice.ts                 # Auth state
    ├── cartSlice.ts                 # Cart state
    └── addressSlice.ts              # Address state
```

---

## 🗺️ Маршруты приложения

### Публичные маршруты

| Маршрут | Компонент | Описание |
|---------|-----------|----------|
| `/` | `HomePage` | Лендинг / главная страница |
| `/menu` | `PublicMenuPage` | Просмотр меню без регистрации |
| `/booking` | `PublicBookingPage` | Бронирование столика без регистрации |
| `/login` | `LoginPage` | Страница входа |
| `/signup` | `SignupPage` | Страница регистрации |
| `/forgot-password` | `ForgotPasswordPage` | Запрос сброса пароля |
| `/reset-password` | `ResetPasswordPage` | Сброс пароля |

### Приватные маршруты (требуют авторизации)

| Маршрут | Компонент | Описание |
|---------|-----------|----------|
| `/` (auth) | `MainPage` | Главная с меню и корзиной |
| `/profile` | `ProfilePage` | Профиль пользователя |
| `/checkout` | `CheckoutPage` | Оформление заказа |
| `/orders` | `OrderTrackingPage` | Отслеживание заказов |
| `/gift` | `GiftCardPage` | Подарочные сертификаты |
| `/user-booking` | `UserBookingPage` | Управление бронированиями |

### Административные маршруты

| Маршрут | Компонент | Описание |
|---------|-----------|----------|
| `/admin` | `AdminPage` | Дашборд администратора |
| `/admin/menu` | `AdminMenuPage` | Управление меню |
| `/admin/booking` | `AdminBookingPage` | Управление бронированиями |

---

## 🔄 Redux State

### `authSlice`

```typescript
{
  isAuthenticated: boolean
  isAdmin: boolean
  user: {
    id: number
    email: string
    phone: string
    firstName: string
    lastName: string
    bonuses: number
  } | null
  accessToken: string | null
  refreshToken: string | null
}
```

### `cartSlice`

```typescript
{
  items: CartItem[]   // { menuItem, quantity }
  totalPrice: number
  totalItems: number
}
```

### `addressSlice`

```typescript
{
  addresses: Address[]
  selectedAddress: Address | null
}
```

---

## 🔐 Работа с токенами

`api.ts` автоматически:
- Добавляет `Authorization: Bearer <token>` к защищённым запросам
- При получении ответа `401` обращается к `/auth/refreshToken`
- Повторяет оригинальный запрос с новым access token
- При неуспешном обновлении токена — разлогинивает пользователя

---

## 🚀 Скрипты

```bash
npm start          # Запуск дев-сервера (http://localhost:3000)
npm run build      # Сборка для продакшена
npm test           # Запуск тестов
```

---

## 🗺️ Интеграция с Яндекс.Картами

Для работы автодополнения адресов необходимо указать ключи API в `.env`:

```env
REACT_APP_SUGGEST_URL=https://suggest-maps.yandex.ru/v1/suggest
REACT_APP_SUGGEST_API_KEY=ваш_ключ
REACT_APP_GEOCODER_URL=https://maps.yandex.ru/api
REACT_APP_GEOCODER_API_KEY=ваш_ключ
```

Ключи получаются в [Кабинете разработчика Яндекс](https://developer.tech.yandex.ru/).
