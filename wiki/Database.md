# 🗄️ База данных

## СУБД

**PostgreSQL** — реляционная база данных. ORM — **GORM** с AutoMigrate.

Имя базы данных по умолчанию: `chipsi`

---

## Схема таблиц

### `users` — Пользователи

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `email` | VARCHAR | Email (уникальный) |
| `phone` | VARCHAR | Номер телефона |
| `password` | VARCHAR | Хеш пароля (bcrypt) |
| `first_name` | VARCHAR | Имя |
| `last_name` | VARCHAR | Фамилия |
| `is_admin` | BOOLEAN | Флаг администратора |
| `created_at` | TIMESTAMP | Дата регистрации |

---

### `categories` — Категории меню

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `name` | VARCHAR | Название категории |
| `description` | TEXT | Описание |

---

### `menu_items` — Блюда меню

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `name` | VARCHAR | Название блюда |
| `description` | TEXT | Описание |
| `price` | DECIMAL | Цена |
| `category_id` | INTEGER | FK → `categories.id` |
| `image_url` | VARCHAR | URL изображения (MinIO) |

---

### `orders` — Заказы

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `user_id` | INTEGER | FK → `users.id` |
| `total_price` | DECIMAL | Итоговая сумма |
| `status` | VARCHAR | Статус заказа |
| `bonuses_applied` | INTEGER | Использовано бонусов |
| `certificate_code` | VARCHAR | Код сертификата (если применён) |
| `created_at` | TIMESTAMP | Дата создания |

**Статусы:** `pending` → `preparing` → `delivered` / `canceled`

---

### `order_items` — Позиции заказа

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `order_id` | INTEGER | FK → `orders.id` |
| `menu_item_id` | INTEGER | FK → `menu_items.id` |
| `quantity` | INTEGER | Количество |
| `price` | DECIMAL | Цена за единицу |

---

### `deliveries` — Доставка

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `order_id` | INTEGER | FK → `orders.id` |
| `address` | VARCHAR | Адрес доставки |
| `floor` | VARCHAR | Этаж |
| `apartment` | VARCHAR | Квартира |
| `intercom` | VARCHAR | Код домофона |
| `status` | VARCHAR | Статус доставки |

**Статусы:** `pending` → `on the way` → `delivered`

---

### `reservations` — Бронирования столиков

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `user_id` | INTEGER | FK → `users.id` (NULL для гостей) |
| `date` | DATE | Дата брони |
| `time` | VARCHAR | Время |
| `guests` | INTEGER | Количество гостей |
| `status` | VARCHAR | Статус |
| `guest_name` | VARCHAR | Имя гостя (для гостевой брони) |
| `guest_email` | VARCHAR | Email гостя |
| `created_at` | TIMESTAMP | Дата создания |

**Статусы:** `pending` → `confirmed` / `canceled`

---

### `events` — Мероприятия

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `user_id` | INTEGER | FK → `users.id` |
| `date` | DATE | Дата мероприятия |
| `time` | VARCHAR | Время |
| `guests` | INTEGER | Количество гостей |
| `description` | TEXT | Описание мероприятия |
| `status` | VARCHAR | Статус |
| `created_at` | TIMESTAMP | Дата создания |

**Статусы:** `pending` → `confirmed` / `rejected`

---

### `gift_certificates` — Подарочные сертификаты

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `code` | VARCHAR | Уникальный код |
| `amount` | DECIMAL | Номинал |
| `sender_id` | INTEGER | FK → `users.id` (отправитель) |
| `receiver_email` | VARCHAR | Email получателя |
| `status` | VARCHAR | Статус |
| `created_at` | TIMESTAMP | Дата создания |
| `expires_at` | TIMESTAMP | Срок действия |

**Статусы:** `active` → `used` / `expired`

---

### `bonuses` — Бонусные баллы

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `user_id` | INTEGER | FK → `users.id` |
| `amount` | INTEGER | Количество баллов |
| `created_at` | TIMESTAMP | Дата начисления |
| `description` | VARCHAR | Описание (откуда начислены) |

---

### `password_reset_tokens` — Токены сброса пароля

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL | Первичный ключ |
| `user_id` | INTEGER | FK → `users.id` |
| `token` | VARCHAR | Одноразовый токен |
| `expires_at` | TIMESTAMP | Срок действия |
| `used` | BOOLEAN | Использован |

---

## Связи между таблицами

```
users ──────────┬────── orders ──── order_items ──── menu_items
                │         └──── deliveries
                ├────── reservations
                ├────── events
                ├────── bonuses
                ├────── gift_certificates (sender)
                └────── password_reset_tokens

categories ──── menu_items
```

---

## Миграции

Миграции выполняются автоматически при запуске бэкенда через GORM `AutoMigrate`. Ручные миграции не требуются.
