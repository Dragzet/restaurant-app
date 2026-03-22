package route

import (
	custommiddleware "chipsiBackend/api/middleware"
	"chipsiBackend/bootstrap"
	"chipsiBackend/setup"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func Setup(app bootstrap.Application) chi.Router {
	r := chi.NewRouter()

	graph := setup.BuildGraph(app)

	adminMiddleware := custommiddleware.IsAdmin(graph.UCs.User)

	r.Use(custommiddleware.SetJSONContentType)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Маршрут для доступа к загруженным файлам
	fs := http.FileServer(http.Dir("./uploads"))
	r.Handle("/uploads/*", http.StripPrefix("/uploads/", fs))

	// Маршрут для Swagger JSON
	r.HandleFunc("/docs/swagger.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		http.ServeFile(w, r, "./docs/swagger.json")
	})

	// Маршрут для Swagger UI
	r.HandleFunc("/docs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		swaggerHTML := `
<!DOCTYPE html>
<html>
  <head>
    <title>Restaurant API - Swagger UI</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css">
    <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/favicon-16x16.png" sizes="16x16" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      body {
        margin:0;
        padding:0;
      }
    </style>
  </head>

  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function() {
        SwaggerUIBundle({
          url: "http://localhost:8080/docs/swagger.json",
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "BaseLayout"
        });
      };
    </script>
  </body>
</html>
		`
		w.Write([]byte(swaggerHTML))
	})

	apiRouter := func(r chi.Router) {
		r.Get("/health", healthCheck)

		r.Mount("/auth/signup", NewSignupRouter(graph.UCs.Signup, app.Log, app.Cfg))
		r.Mount("/auth/login", NewLoginRouter(graph.UCs.Login, app.Log, app.Cfg))
		r.Mount("/auth/refreshToken", NewRefreshTokenRouter(graph.UCs.RefreshToken, app.Log, app.Cfg))
		r.Mount("/auth/password", NewPasswordRouter(graph.UCs.PasswordReset))

		// Публичные эндпоинты для гостей:
		// просмотр категорий меню и позиций меню, а также создание бронирования
		// Гости могут читать меню и отправлять заявку на бронь стола
		publicCategoryRouter := NewCategoryRouter(graph.UCs.Category, adminMiddleware)
		publicMenuItemRouter := NewMenuItemRouter(graph.UCs.MenuItem, adminMiddleware)
		publicReservationRouter := NewReservationRouter(graph.UCs.Reservation, adminMiddleware)

		// Применяем OptionalJwtAuth для публичных маршрутов
		// Это позволит установить UserIDKey если есть валидный токен
		r.Group(func(r chi.Router) {
			r.Use(custommiddleware.OptionalJwtAuth(app.Cfg.App.JwtSecretKey))
			
			r.Mount("/categories", publicCategoryRouter)
			r.Mount("/menuItems", publicMenuItemRouter)
			r.Mount("/reservations", publicReservationRouter)
		})

		// Требуют токен
		r.Group(func(r chi.Router) {
			r.Use(custommiddleware.JwtAuth(app.Cfg.App.JwtSecretKey))

			// Для бонусов, сертификатов, пользователей, заказов и событий по-прежнему требуется авторизация
			r.Mount("/bonuses", NewBonusRouter(graph.UCs.Bonus))
			// Для защищённого доступа к категориям, меню и бронированиям (например, /me и админские операции)
			// можно повторно смонтировать те же роутеры внутри группы, чтобы сохранить поведение для авторизованных
			r.Mount("/giftCertificates", NewGiftCertificateRouter(graph.UCs.GiftCertificate))
			r.Mount("/users", NewUserRouter(graph.UCs.User, app.Log, adminMiddleware))
			r.Mount("/orders", NewOrderRouter(graph.UCs.Order))
			r.Mount("/events", NewEventRouter(graph.UCs.Event, adminMiddleware, app.Log))

		})
	}

	r.Route("/api/v1", apiRouter)

	return r
}

func healthCheck(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := map[string]interface{}{
		"status":    "ok",
		"service":   "chipsiBackend",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	}

	_ = json.NewEncoder(w).Encode(resp)
}
