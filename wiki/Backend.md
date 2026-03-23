# 🔧 Бэкенд

## Технологический стек

| Технология | Назначение |
|-----------|------------|
| Go 1.25 | Язык программирования |
| Chi | HTTP-роутер |
| GORM | ORM для PostgreSQL |
| PostgreSQL | Реляционная база данных |
| JWT (Go-JWT v4) | Аутентификация |
| MinIO | Хранилище изображений (S3-совместимое) |
| Gomail | Отправка email |
| OpenAPI 3.0 | Документация API |

---

## 📁 Структура проекта

```
backend/
├── cmd/
│   └── main.go               # Точка входа
│
├── api/
│   ├── controller/           # HTTP-обработчики
│   │   ├── auth_controller.go
│   │   ├── order_controller.go
│   │   ├── menu_controller.go
│   │   ├── reservation_controller.go
│   │   ├── event_controller.go
│   │   ├── gift_certificate_controller.go
│   │   ├── bonus_controller.go
│   │   ├── user_controller.go
│   │   ├── category_controller.go
│   │   ├── delivery_controller.go
│   │   └── ...
│   ├── middleware/
│   │   ├── auth_middleware.go      # JWT проверка
│   │   ├── admin_middleware.go     # Проверка прав администратора
│   │   └── json_middleware.go      # Content-Type: application/json
│   └── route/
│       ├── router.go              # Главный роутер (монтирование всех маршрутов)
│       ├── auth_route.go
│       ├── order_route.go
│       ├── menu_route.go
│       └── ...                    # ~13 файлов маршрутов
│
├── domain/                    # Сущности и интерфейсы
│   ├── user.go
│   ├── order.go
│   ├── reservation.go
│   ├── menu_item.go
│   ├── event.go
│   ├── gift_certificate.go
│   ├── category.go
│   ├── bonus.go
│   ├── delivery.go
│   ├── constants.go           # Enum-константы (статусы)
│   └── ...
│
├── repository/                # Реализация работы с БД
│   ├── user_repository.go
│   ├── order_repository.go
│   ├── reservation_repository.go
│   └── ...                    # ~9 репозиториев
│
├── usecase/                   # Бизнес-логика
│   ├── auth_usecase.go
│   ├── order_usecase.go
│   ├── reservation_usecase.go
│   └── ...                    # ~13 юзкейсов
│
├── bootstrap/
│   ├── app.go                 # Запуск приложения
│   ├── config.go              # Загрузка конфигурации из YAML
│   └── database.go            # Инициализация БД и AutoMigrate
│
├── internal/
│   ├── mailer/                # Email-сервис (Gomail)
│   ├── scheduler/             # Планировщик (обновление статусов заказов)
│   └── tokenutil/             # Утилиты JWT
│
├── setup/                     # Dependency Injection
│   └── setup.go               # Сборка всех зависимостей
│
├── config/
│   ├── local.yaml             # Конфиг для локальной разработки
│   └── production.yaml        # Конфиг для продакшена
│
├── docs/
│   ├── swagger.yaml           # OpenAPI 3.0 спецификация
│   └── swagger.json
│
└── Dockerfile                 # Multi-stage Docker сборка
```

---

## ⚙️ Конфигурация

Конфигурация загружается из YAML-файла. Путь к файлу задаётся переменной окружения или флагом запуска.

Пример `config/local.yaml`:

```yaml
server:
  address: localhost:8080

db:
  host: localhost
  port: 5432
  user: postgres
  password: password
  dbname: chipsi

jwt:
  accessTokenExpiryHour: 2
  refreshTokenExpiryHour: 168
  accessTokenSecret: secret_key_access
  refreshTokenSecret: secret_key_refresh

minio:
  endpoint: localhost:9000
  accessKeyID: minioadmin
  secretAccessKey: minioadmin
  useSSL: false
  bucketName: restaurant-images

mail:
  host: smtp.yandex.ru
  port: 465
  username: noreply@example.ru
  password: mail_password
  from: noreply@example.ru
```

---

## 🔁 Планировщик (Scheduler)

Фоновый планировщик автоматически обновляет статусы заказов:

- Запускается при старте приложения
- Работает каждую минуту
- Переводит заказы: `pending` → `preparing` → `delivered`

---

## 📧 Email-уведомления

Используется SMTP через Яндекс.Почту (Gomail):

- Подтверждение регистрации
- Ссылка для сброса пароля
- Уведомление о статусе заказа

---

## 🗄️ Миграции базы данных

GORM AutoMigrate запускается автоматически при старте в `bootstrap/database.go` — создаёт или обновляет таблицы на основе domain-структур.

---

## 🐳 Docker-сборка

Используется multi-stage Dockerfile:

```dockerfile
# Этап 1: Сборка
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main ./cmd

# Этап 2: Минимальный образ
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
COPY config/ config/
EXPOSE 8080
CMD ["./main"]
```

---

## 🩺 Health Check

```
GET /health → 200 OK
```

Используется для мониторинга работоспособности сервиса.
