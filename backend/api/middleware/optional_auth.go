package middleware

import (
	"chipsiBackend/internal/tokenutil"
	"context"
	"net/http"
	"strings"
)

func OptionalJwtAuth(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			t := strings.Split(authHeader, " ")
			if len(t) == 2 {
				authToken := t[1]
				authorized, _ := tokenutil.IsAuthorized(authToken, secret)
				if authorized {
					userID, err := tokenutil.ExtractIDFromToken(authToken, secret)
					if err == nil && userID != "" {
						ctx := context.WithValue(r.Context(), UserIDKey, userID)
						next.ServeHTTP(w, r.WithContext(ctx))
						return
					}
				}
			}
			// Если авторизация не удалась или токена нет, продолжаем без userID
			next.ServeHTTP(w, r)
		})
	}
}
