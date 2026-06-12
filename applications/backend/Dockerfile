# ============================================================
# Multi-stage Dockerfile for nexops-backend (Go)
# ============================================================

# --- Stage 1: Builder ---
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

# Download dependencies
COPY go.mod ./
RUN go mod download

# Build the application
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o nexops-backend .

# --- Stage 2: Runtime ---
FROM alpine:3.19

# Security: Run as non-root user
RUN addgroup -S nexops && adduser -S nexops -G nexops

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/nexops-backend .

# Change ownership to non-root user
RUN chown -R nexops:nexops /app

USER nexops

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

CMD ["./nexops-backend"]
