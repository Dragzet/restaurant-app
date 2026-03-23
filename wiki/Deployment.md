# 🚀 Деплой

## Обзор инфраструктуры

```
Internet
    │
    ▼
┌─────────────────────────┐
│   Nginx (порт 80/443)   │  ← фронтенд + reverse proxy
└───────────┬─────────────┘
            │ /api/* → localhost:8080
┌───────────▼─────────────┐
│    Go Backend (8080)    │
└───────────┬─────────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
PostgreSQL          MinIO
 (5432)            (9000)
```

---

## 🐳 Docker

### Бэкенд

```bash
cd backend
docker build -t restaurant-api:latest .
docker run -d \
  --name restaurant-api \
  -p 8080:8080 \
  -v $(pwd)/config:/app/config \
  restaurant-api:latest
```

**Dockerfile (backend)** использует multi-stage сборку:
- **Этап 1**: `golang:alpine` — компиляция бинарника
- **Этап 2**: `alpine:latest` — минимальный образ с бинарником

### Фронтенд

```bash
cd frontend
docker build -t restaurant-frontend:latest .
docker run -d \
  --name restaurant-frontend \
  -p 80:80 \
  restaurant-frontend:latest
```

**Dockerfile (frontend)** использует multi-stage сборку:
- **Этап 1**: `node:alpine` — сборка React SPA (`npm run build`)
- **Этап 2**: `nginx:alpine` — раздача статики + reverse proxy

---

## ⚙️ Конфигурация Nginx

`frontend/docker/nginx.conf`:

```nginx
server {
    listen 80;

    # Статика фронтенда
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy к Go API
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Swagger документация
    location /docs {
        proxy_pass http://backend:8080/docs;
    }

    # Загруженные файлы
    location /uploads/ {
        proxy_pass http://backend:8080/uploads/;
    }
}
```

---

## 🔐 Переменные окружения продакшена

### Бэкенд (`config/production.yaml`)

```yaml
server:
  address: 0.0.0.0:8080

db:
  host: your_postgres_host
  port: 5432
  user: your_db_user
  password: your_db_password
  dbname: chipsi

jwt:
  accessTokenExpiryHour: 2
  refreshTokenExpiryHour: 168
  accessTokenSecret: strong_random_secret_1
  refreshTokenSecret: strong_random_secret_2

minio:
  endpoint: your_minio_host:9000
  accessKeyID: your_minio_key
  secretAccessKey: your_minio_secret
  useSSL: true
  bucketName: restaurant-images

mail:
  host: smtp.yandex.ru
  port: 465
  username: noreply@yourdomain.ru
  password: your_mail_password
  from: noreply@yourdomain.ru
```

### Фронтенд (`.env.production`)

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SUGGEST_URL=https://suggest-maps.yandex.ru/v1/suggest
REACT_APP_SUGGEST_API_KEY=your_yandex_suggest_key
REACT_APP_GEOCODER_URL=https://maps.yandex.ru/api
REACT_APP_GEOCODER_API_KEY=your_yandex_geocoder_key
```

---

## 🩺 Мониторинг

Health-эндпоинт бэкенда:

```bash
curl https://api.yourdomain.com/health
# Ожидаемый ответ: 200 OK
```

---

## 🔒 Рекомендации для продакшена

1. **Используйте HTTPS** — настройте SSL-сертификат (Let's Encrypt) в Nginx
2. **Надёжные JWT секреты** — используйте случайные строки длиной 64+ символов
3. **Ограничьте доступ к MinIO** — не открывайте порт 9000 наружу
4. **Регулярные бэкапы** PostgreSQL (`pg_dump`)
5. **Установите rate limiting** в Nginx для защиты API
6. **Логирование** — настройте централизованное хранение логов
