# ⚙️ Установка и запуск

Это руководство описывает, как развернуть проект локально для разработки.

---

## Требования

| Инструмент | Версия |
|------------|--------|
| Go | 1.25+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |
| MinIO | последняя |
| Docker (опционально) | 20+ |

---

## 🗄️ Настройка базы данных

1. Установите и запустите PostgreSQL.
2. Создайте базу данных:

```sql
CREATE DATABASE chipsi;
```

3. Убедитесь, что у пользователя есть права на эту базу данных.

> Миграции таблиц выполняются автоматически при первом запуске бэкенда через GORM AutoMigrate.

---

## 🔧 Бэкенд (Go)

### 1. Перейдите в директорию бэкенда

```bash
cd backend
```

### 2. Установите зависимости

```bash
go mod download
```

### 3. Настройте конфигурацию

Отредактируйте файл `config/local.yaml`:

```yaml
server:
  address: localhost:8080

db:
  host: localhost
  port: 5432
  user: your_db_user
  password: your_password
  dbname: chipsi

jwt:
  accessTokenExpiryHour: 2
  refreshTokenExpiryHour: 168
  accessTokenSecret: your_access_secret
  refreshTokenSecret: your_refresh_secret

minio:
  endpoint: localhost:9000
  accessKeyID: minioadmin
  secretAccessKey: minioadmin
  useSSL: false
  bucketName: restaurant-images

mail:
  host: smtp.yandex.ru
  port: 465
  username: your@yandex.ru
  password: your_mail_password
  from: your@yandex.ru
```

### 4. Запустите сервер

```bash
go run ./cmd
```

Сервер будет доступен по адресу: **http://localhost:8080**

Swagger UI: **http://localhost:8080/docs**

### 5. Сборка для продакшена

```bash
go build -o main ./cmd
./main
```

---

## 🌐 Фронтенд (React)

### 1. Перейдите в директорию фронтенда

```bash
cd frontend
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Настройте переменные окружения

Отредактируйте файл `.env`:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_SUGGEST_URL=https://suggest-maps.yandex.ru/v1/suggest
REACT_APP_SUGGEST_API_KEY=ваш_ключ_яндекс
REACT_APP_GEOCODER_URL=https://maps.yandex.ru/api
REACT_APP_GEOCODER_API_KEY=ваш_ключ_яндекс
```

### 4. Запустите дев-сервер

```bash
npm start
```

Фронтенд будет доступен по адресу: **http://localhost:3000**

Запросы к `/api/*` автоматически проксируются на `http://localhost:8080`.

### 5. Сборка для продакшена

```bash
npm run build
```

Артефакты сборки будут в директории `build/`.

---

## 🐳 Запуск через Docker

Для запуска всего стека через Docker используйте Dockerfile'ы в соответствующих директориях:

```bash
# Сборка и запуск бэкенда
cd backend
docker build -t restaurant-api .
docker run -p 8080:8080 --env-file .env restaurant-api

# Сборка и запуск фронтенда
cd frontend
docker build -t restaurant-frontend .
docker run -p 80:80 restaurant-frontend
```

Подробнее о Docker-деплое см. [Деплой](Deployment).

---

## ✅ Проверка работоспособности

После запуска проверьте health-эндпоинт:

```bash
curl http://localhost:8080/health
```

Ожидаемый ответ: `200 OK`
