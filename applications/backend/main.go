package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

type AppInfo struct {
	Service     string `json:"service"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
	Status      string `json:"status"`
	Message     string `json:"message"`
}

type HealthResponse struct {
	Status string `json:"status"`
}

type ReadyResponse struct {
	Status string `json:"status"`
	DB     string `json:"db"`
	Error  string `json:"error,omitempty"`
}

func getDBConnection() (*sql.DB, error) {
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "nexops-db"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "nexops_app"
	}
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "nexops_app"
	}
	dbPassword := os.Getenv("DB_PASSWORD")

	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbUser, dbPassword, dbName)
	return sql.Open("postgres", connStr)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "unknown"
	}
	version := os.Getenv("APP_VERSION")
	if version == "" {
		version = "0.0.1"
	}

	info := AppInfo{
		Service:     "nexops-backend",
		Environment: env,
		Version:     version,
		Status:      "healthy",
		Message:     "Welcome to NexOps Backend API (Go) — built by Ichramsyah Abdurrachman",
	}

	w.Header().Set("Content-Type", "application/json")
	// Allow CORS for frontend
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(info)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(HealthResponse{Status: "ok"})
}

func readyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	db, err := getDBConnection()
	if err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(ReadyResponse{Status: "not_ready", DB: "unreachable", Error: err.Error()})
		return
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(ReadyResponse{Status: "not_ready", DB: "unreachable", Error: err.Error()})
		return
	}

	json.NewEncoder(w).Encode(ReadyResponse{Status: "ready", DB: "connected"})
}

func infoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	
	info := map[string]interface{}{
		"platform": "NexOps Platform",
		"author":   "Ichramsyah Abdurrachman",
		"stack": map[string]string{
			"infra":         "Terraform + GCP Compute Engine",
			"config_mgmt":   "Ansible",
			"kubernetes":    "K3s (self-managed)",
			"ci":            "Jenkins + Trivy + SonarQube",
			"cd":            "ArgoCD (GitOps)",
			"observability": "Prometheus + Grafana + Loki",
			"application":   "React (Frontend) + Go (Backend) + PostgreSQL",
		},
	}
	json.NewEncoder(w).Encode(info)
}

func main() {
	http.HandleFunc("/api/", indexHandler)
	http.HandleFunc("/api/health", healthHandler)
	http.HandleFunc("/api/ready", readyHandler)
	http.HandleFunc("/api/info", infoHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server listening on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
