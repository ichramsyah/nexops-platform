-- applications/database/init.sql
-- Database initialization for NexOps Backend

CREATE TABLE IF NOT EXISTS deployments (
    id          SERIAL PRIMARY KEY,
    app_name    VARCHAR(100) NOT NULL,
    version     VARCHAR(50)  NOT NULL,
    environment VARCHAR(50)  NOT NULL,
    deployed_at TIMESTAMP    DEFAULT NOW(),
    deployed_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS health_checks (
    id          SERIAL PRIMARY KEY,
    checked_at  TIMESTAMP DEFAULT NOW(),
    status      VARCHAR(20),
    latency_ms  INTEGER
);

INSERT INTO deployments (app_name, version, environment, deployed_by)
VALUES ('nexops-backend', '0.0.1', 'staging', 'init-script');
