package route

import (
	custommiddleware "chipsiBackend/api/middleware"
	"chipsiBackend/bootstrap"
	"chipsiBackend/setup"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"net/http"
	"time"
)

func Setup(app bootstrap.Application) chi.Router {
	r := chi.NewRouter()

	graph := setup.BuildGraph(app)

	adminMiddleware := custommiddleware.IsAdmin(graph.UCs.User)

	r.Use(custommiddleware.SetJSONContentType)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

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

		// Монтируем публичные роуты отдельно, до применения JwtAuth
		// Для категорий и меню это те же роутеры, но доступ к GET-методам
		// уже реализован без adminHandler внутри самих роутеров
		r.Mount("/categories", publicCategoryRouter)
		r.Mount("/menuItems", publicMenuItemRouter)
		// Для бронирований CreateReservation (POST /reservations) станет доступен без токена
		r.Mount("/reservations", publicReservationRouter)

		// Требуют токен
		r.Group(func(r chi.Router) {
			r.Use(custommiddleware.JwtAuth(app.Cfg.App.JwtSecretKey))

			// Для бонусов, сертификатов, пользователей, заказов и событий по-прежнему требуется авторизация
			r.Mount("/bonuses", NewBonusRouter(graph.UCs.Bonus))
			// Для защищённого доступа к категориям, меню и бронированиям (например, /me и админские операции)
			// можно повторно смонтировать те же роутеры внутри группы, чтобы сохранить поведение для авторизованных
			r.Mount("/categories", NewCategoryRouter(graph.UCs.Category, adminMiddleware))
			r.Mount("/menuItems", NewMenuItemRouter(graph.UCs.MenuItem, adminMiddleware))
			r.Mount("/giftCertificates", NewGiftCertificateRouter(graph.UCs.GiftCertificate))
			r.Mount("/users", NewUserRouter(graph.UCs.User, app.Log, adminMiddleware))
			r.Mount("/orders", NewOrderRouter(graph.UCs.Order))
			r.Mount("/reservations", NewReservationRouter(graph.UCs.Reservation, adminMiddleware))
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
