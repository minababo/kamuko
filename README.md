# PUSL3120 – Restaurant Takeaway System

This repository contains the coursework for PUSL3120 (Full-Stack Development)

## Project Overview

A restaurant takeaway web application where customers can place orders from a menu and track order status in real time. Staff users (cashier/manager) manage orders and menu items via role-based dashboards.

## Architecture

- Frontend: React + Tailwind CSS (containerised)
- Backend: Node.js (Express) – monolithic architecture
- Database: MongoDB (Docker)
- Communication: REST APIs + WebSockets (planned)
- Orchestration: Docker Compose

## Repository Structure

- `api/` – Backend application
- `client/` – Frontend application (to be added)
- `docker-compose.yml` – Multi-container orchestration

## Development Setup (Backend + Database)

```bash
docker compose up -d --build
```

## API health check:

```bash
http://localhost:5000/health
```

## Mongo Express:

```arduino
http://localhost:8081
```

## Status

Initial project setup complete. Core entities and features will be implemented in subsequent phases
