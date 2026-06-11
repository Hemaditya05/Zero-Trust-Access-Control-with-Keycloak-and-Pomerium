# ZTCA Internal Portal — Zero Trust Multi-App Demo

A multi-application Zero Trust Cybersecurity Architecture (ZTCA) demo built with React, Node.js, and Docker. Each app simulates a real enterprise application protected externally by **Keycloak** (identity) and **Pomerium** (per-app authorization).

> **No authentication is built inside any app.** All access control is handled externally through Pomerium and Keycloak.

---

## Project Overview

This project demonstrates a Zero Trust access model where:

1. **Keycloak** acts as the Identity Provider (IdP), managing users, groups, and issuing OIDC tokens.
2. **Pomerium** acts as the identity-aware reverse proxy, enforcing per-route access policies.
3. **Each app** is a standalone React frontend with working interactive functionality.
4. **No VPN** is needed — Cloudflare Tunnel and Tailscale provide secure connectivity.

---

## Folder Structure

```
ztca-portal/
├── docker-compose.yml
├── dev.js                       # Local development launcher
├── README.md
├── backend/                     # Express API
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
└── apps/
    ├── main-portal/             # Central launcher (port 3000)
    ├── admin-panel/             # Admin IAM dashboard
    ├── server-console/          # Server operations console
    ├── audit-logs/              # Security audit trail
    ├── dev-dashboard/           # CI/CD & engineering
    ├── internal-tools/          # Utilities & API tester
    └── learning-portal/         # Zero Trust training
        ├── package.json
        ├── vite.config.js
        ├── index.html
        ├── Dockerfile
        ├── nginx.conf
        └── src/
            ├── main.jsx
            ├── App.jsx
            └── index.css
```

---

## App Purpose & Functionality

| App | Purpose | Interactive Features |
|-----|---------|---------------------|
| **Main Portal** | Central app launcher | Search/filter apps, role matrix table, Zero Trust flow diagram |
| **Admin Panel** | Identity & access management | User table with search, group change dropdown, apply role changes, policy summary |
| **Server Console** | Server operations | Server status cards, restart simulation, active sessions, command console |
| **Audit Logs** | Security audit trail | Event table with filters (decision/group), search, CSV export, stats cards |
| **Dev Dashboard** | CI/CD & engineering | Build pipeline trigger (queued→running→success), API health, ticket filter, deployment timeline |
| **Internal Tools** | Utilities & diagnostics | API tester form, tool buttons with output, service registry, environment selector |
| **Learning Portal** | Zero Trust training | Module progress checklist, 5-question quiz with scoring, glossary cards, flow diagram |

---

## Role Access Matrix

| Role | Portal | Admin | Server | Audit | Dev | Tools | Learning |
|------|--------|-------|--------|-------|-----|-------|----------|
| **Admin** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Engineer** | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| **Intern** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Pomerium Route Mapping

| Route | Upstream Service | Allowed Groups |
|-------|-----------------|----------------|
| `portal.ztca.local` | `main-portal:3000` | Any authenticated user |
| `admin.ztca.local` | `admin-panel:3000` | `/admin` only |
| `server.ztca.local` | `server-console:3000` | `/admin` only |
| `audit.ztca.local` | `audit-logs:3000` | `/admin` only |
| `dev.ztca.local` | `dev-dashboard:3000` | `/admin` or `/engineer` |
| `tools.ztca.local` | `internal-tools:3000` | `/admin` or `/engineer` |
| `learn.ztca.local` | `learning-portal:3000` | `/admin` or `/engineer` or `/intern` |

All routes use HTTPS on port **8443** via Pomerium.

---

## Zscaler Project Mapping

### Project 1 — Zero Trust Network Access (ZTNA)

| ZTCA Component | Zscaler Equivalent |
|----------------|-------------------|
| Pomerium | Zscaler Private Access (ZPA) |
| Cloudflare Tunnel | Zscaler App Connector |
| Tailscale | Zscaler Client Connector |
| Keycloak | Zscaler IdP Integration |

### Project 3 — Identity-Aware Access Control

| ZTCA Component | Zscaler Equivalent |
|----------------|-------------------|
| Keycloak Groups/RBAC | ZPA Access Policies |
| Pomerium per-route policies | ZPA Application Segments |
| Audit Logs app | Zscaler Activity Insights |
| Admin Panel | ZPA Admin Portal |

---

## Architecture

```
User → Pomerium (Reverse Proxy) → Keycloak (IdP) → Policy Check → App
```

- **Keycloak** handles identity: login, SSO, MFA, group assignment, OIDC token issuance.
- **Pomerium** handles authorization: checks the JWT claims (group membership) against per-route policies.
- **Apps** are unaware of auth — they receive pre-authenticated traffic from Pomerium.
- **Cloudflare Tunnel** provides secure ingress without exposing ports.
- **Tailscale** provides mesh networking for internal service communication.
- **Boundary** provides just-in-time credential injection for SSH/RDP access.

---

## Docker Services

| Service | Internal Address | Publicly Exposed |
|---------|-----------------|------------------|
| `backend` | `backend:5000` | Yes (port 5000) |
| `main-portal` | `main-portal:3000` | No (via Pomerium) |
| `admin-panel` | `admin-panel:3000` | No (via Pomerium) |
| `server-console` | `server-console:3000` | No (via Pomerium) |
| `audit-logs` | `audit-logs:3000` | No (via Pomerium) |
| `dev-dashboard` | `dev-dashboard:3000` | No (via Pomerium) |
| `internal-tools` | `internal-tools:3000` | No (via Pomerium) |
| `learning-portal` | `learning-portal:3000` | No (via Pomerium) |

---

## Quick Start

### Local Development (any single app)

```bash
cd ztca-portal/apps/main-portal
npm install
npm run dev
```

### Docker

```bash
cd ztca-portal
docker-compose up --build
```

---

## Tech Stack

- **Frontend**: React 18 + Vite + Lucide Icons
- **Backend**: Node.js + Express
- **Containerization**: Docker + Docker Compose + Nginx
- **Theme**: Soft watercolor cream and blue aesthetic (Playfair Display)
- **Auth** (external): Keycloak + Pomerium + Cloudflare Tunnel + Tailscale + Boundary
